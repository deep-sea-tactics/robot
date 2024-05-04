use anyhow::Result;
use image::{io::Reader as ImageReader, DynamicImage, Luma, Pixel, Rgb};
use imageproc::{
    contours::{find_contours_with_threshold, Contour},
    map::map_colors,
    point::Point,
};
use num::{integer::sqrt, abs};

const PINK: Rgb<u8> = Rgb([255, 0, 240]);
const PINK_THRESHOLD: u8 = 200;

/// A point from 0-1, relative to the width and height of the image.
type PercentagePoint = Point<f32>;

/// Gets the point as a percentage for broadcasting back to `web`
fn point_as_percentage<T>(point: Point<T>, dimensions: Point<usize>) -> PercentagePoint
where
    f32: From<T>,
{
    PercentagePoint {
        x: Into::<f32>::into(point.x) / dimensions.x as f32,
        y: Into::<f32>::into(point.y) / dimensions.y as f32,
    }
}

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
struct Extrema<T> {
    min: Point<T>,
    max: Point<T>,
}

impl<T> Extrema<T> {
    fn to_percentage_point(&self, dimensions: Point<usize>) -> Extrema<f32>
    where
        f32: From<T>,
        T: Clone
    {
        Extrema {
            min: point_as_percentage(self.min.clone(), dimensions),
            max: point_as_percentage(self.max.clone(), dimensions),
        }
    }
}

/// Find the extrema of a series of contours.
fn contours_extrema(contours: &[Contour<usize>]) -> Extrema<usize> {
    let points = contours
        .iter()
        .flat_map(|contour| &contour.points)
        .collect::<Vec<_>>();

    let mut x_min = usize::MAX;
    let mut y_min = usize::MAX;
    let mut x_max = 0;
    let mut y_max = 0;

    for point in points {
        if x_min > point.x {
            x_min = point.x;
        }

        if y_min > point.y {
            y_min = point.y;
        }

        if x_max < point.x {
            x_max = point.x;
        }

        if y_max < point.y {
            y_max = point.y;
        }
    }

    Extrema {
        min: Point { x: x_min, y: y_min },
        max: Point { x: x_max, y: y_max },
    }
}

/// Finds the difference between two colors
fn distance(first: Rgb<u8>, second: Rgb<u8>) -> usize {
    let [r1, g1, b1] = first.0;
    let [r2, g2, b2] = second.0;
    let r = r1 as isize - r2 as isize;
    let g = g1 as isize - g2 as isize;
    let b = b1 as isize - b2 as isize;

    (r * r + g * g + b * b) as usize
}

fn process_image(image: DynamicImage) -> Result<()> {
    let image = map_colors(&image, |p| {
        let dist = distance(PINK, p.to_rgb());

        Luma::<u8>([abs(255 as isize - sqrt(dist) as isize) as u8])
    });

    // TODO: find with threshold
    let contours = find_contours_with_threshold::<usize>(&image, PINK_THRESHOLD);

    let mut image = map_colors(&image, |p| Rgb([p.0[0], p.0[0], p.0[0]]));

    for contour in &contours {
        for pixel in &contour.points {
            *image.get_pixel_mut(pixel.x as u32, pixel.y as u32) = Rgb([0, 127, 0]);
        }
    }

    let extrema = contours_extrema(&contours);
    let extrema = Extrema {
        min: Point {
            x: extrema.min.x as f32,
            y: extrema.min.y as f32
        },
        max: Point  {
            x: extrema.max.x as f32,
            y: extrema.max.y as f32
        }
    };

    dbg!(extrema.to_percentage_point(
        {
            let (x, y) = image.dimensions();

            Point {
                x: x as usize,
                y: y as usize
            }
        }
    ));

    image.save("./test.png")?;

    Ok(())
}

fn main() -> Result<()> {
    let loaded_image =
        ImageReader::open("/workspace/robot/broadcaster/kittens_and_pink_square.jpeg")
            .expect("Failed to open file.")
            .decode()?;

    process_image(loaded_image)?;

    Ok(())
}

#[cfg(test)]
mod test {
    #[test]
    fn check_kittens() {}
}
