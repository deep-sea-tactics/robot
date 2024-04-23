use image::io::Reader as ImageReader;
use num::clamp;

/*
#FF00F0 is the pink color used for testing.
This is 255, 0, 240 in RGB. Note: The image library has decided that the color of the test images is 255, 0, 240.

Note: A lot of this is just boilerplate code.
The plan is to test all the pixels in an image against the pink color and deduce that the 'most pink' parts of the image are the pink square.

This could probably be more efficient. We could probably have just used a different library, but I don't know what I'm doing TM (so I'm improvising :) ).

Origin is the top left corner.

Positive Y values move down (tis` awful but images are loaded in the fourth quadrant)
*/

#[derive(Clone)]
struct PixelPosition {
    x: usize,
    y: usize,
}
impl PixelPosition {
    fn new(x: usize, y: usize) -> PixelPosition {
        PixelPosition { x, y }
    }
}

struct Position {
    x: f32,
    y: f32,
}
impl Position {
    fn new(x: f32, y: f32) -> Position {
        Position { x, y }
    }

    fn from_pixel_position(from: PixelPosition) -> Position {
        let mut res = Position::new(0.0, 0.0);

        unsafe { //sorry tristan
            res.x = from.x as f32/IMAGE_DIMENSIONS.edge2.x as f32;
            res.y = from.x as f32/IMAGE_DIMENSIONS.edge2.y as f32;
        }

        res
    }

    fn debug_dump(&self) {
        println!("X position: {}", self.x);
        println!("Y position: {}", self.y);
    }
}

struct PercRect {
    edge1: Position,
    edge2: Position,
}
impl PercRect {
    fn new(x1: f32, y1: f32, x2: f32, y2: f32) -> PercRect {
        let edge1 = Position::new(x1, y1);
        let edge2 = Position::new(x2, y2);

        PercRect {
            edge1,
            edge2,
        }
    }
}

struct PixelRect {
    edge1: PixelPosition,
    edge2: PixelPosition,
}
impl PixelRect {
    fn new(x1: usize, y1: usize, x2: usize, y2: usize) -> PixelRect {
        let edge1 = PixelPosition::new(x1, y1);
        let edge2 = PixelPosition::new(x2, y2);

        PixelRect {
            edge1,
            edge2,
        }
    }
}

#[derive(Clone)]
struct RGBStruct {
    r: u8,
    g: u8,
    b: u8,
    is_pink: bool,
}
impl RGBStruct {
    fn new(r: u8, g: u8, b: u8) -> RGBStruct {
        RGBStruct {
            r,
            g,
            b,
            is_pink: false,
        }
    }

    //TODO: Operator overload
    fn difference(&self, against: RGBStruct) -> RGBStruct {
        let mut res = RGBStruct::new(0, 0, 0);

        res.r = difference_of_rgb_value(self.r, against.r);
        res.g = difference_of_rgb_value(self.g, against.g);
        res.b = difference_of_rgb_value(self.b, against.b);

        res
    }

    fn to_scalar(&self) -> u16 {
        let mut res: u16 = 0;

        res += self.r as u16;
        res += self.g as u16;
        res += self.b as u16;

        res
    }

    fn perc_diff(&self, against: RGBStruct) -> f32 {
        

        let against_diff: RGBStruct = self.difference(against);
        let scale: u16 = against_diff.to_scalar();

        let perc: f32 = scale as f32 / 100.0;

        let res: f32 = clamp(perc, 0.0, 1.0);

        res
    }

    ///A function for dumping the contents of this struct into the console
    fn debug_dump(&self) {
        println!("R: {}", self.r);
        println!("G: {}", self.g);
        println!("B: {}", self.b);
        println!("Is pink? {}", self.is_pink);
    }
}

const PINK_SQUARE_OUT_OF_FRAME_MIN: f32 = 0.1;
const IS_PINK_DEVIANT: f32 = 0.1;
const PINK: RGBStruct = RGBStruct {
    r: 255,
    g: 0,
    b: 240,
    is_pink: true,
};

static mut PIXELS: Vec<RGBStruct> = vec![];
static mut PIXEL_POSITIONS: Vec<PixelPosition> = vec![];
static mut PINK_PIXELS: Vec<&RGBStruct> = vec![];

static mut PINK_SQUARE_RECTANGLE: PercRect = PercRect {
    edge1: Position { x: 0.0, y: 0.0 },
    edge2: Position { x: 0.0, y: 0.0 },
};

static mut IMAGE_DIMENSIONS: PixelRect = PixelRect {
    edge1: PixelPosition { x: 0, y: 0 },
    edge2: PixelPosition { x: 0, y: 0 },
};

fn difference_of_rgb_value(target: u8, against: u8) -> u8 {
    let res: u8 = (target as i16 - against as i16).unsigned_abs() as u8;

    res
}

fn process_pink_pixels() {
    unsafe {
        for pixel in PIXELS.iter() {
            let pink_perc = pixel.perc_diff(PINK);

            if pink_perc < PINK_SQUARE_OUT_OF_FRAME_MIN {
                pixel.to_owned().is_pink = true;
                PINK_PIXELS.push(pixel);
            }
        }
    }
}

/*
So far assuming that:

The first pink pixel encountered is a corner
The last pink pixel encountered is a corner
*/

/*
fn generate_rectangle()
{
    unsafe
    {
        let begin =
    }
}
*/

fn debug_perc() {
    unsafe {
        let res: f32 = PINK_PIXELS.len() as f32 / PIXELS.len() as f32;

        println!("Percent of pink pixels in image (0 to 1): {res}");
        println!("Pink pixel count: {}", PINK_PIXELS.len());
        println!("Total pixel count: {}", PIXELS.len());
    }
}

fn main() {
    let loaded_image =
        ImageReader::open("/workspace/robot/broadcaster/kittens_and_pink_square.jpeg")
            .expect("Failed to open file.")
            .decode();

    let (width, height) =
        image::image_dimensions("/workspace/robot/broadcaster/kittens_and_pink_square.jpeg")
            .expect("Failed to open file.");

    unsafe {
        IMAGE_DIMENSIONS.edge2.x = width as usize;
        IMAGE_DIMENSIONS.edge2.y = height as usize;
    }

    println!("Image width: {:?}", width);
    println!("Image height: {:?}", height);

    let rgb_image = loaded_image.unwrap().to_rgb8();

    let mut row: u32 = 0;

    for (index, pixel) in rgb_image.pixels().enumerate() {
        let mut new_pixel = RGBStruct::new(0, 0, 0);

        if index % width as usize == 0 {
            row += 1;
        }

        let new_pixel_position = PixelPosition::new(index % width as usize, row as usize);

        for (val_i, rgb_value) in pixel.0.iter().enumerate() {
            match val_i //Try not to: Wretch, Vomit, Scream, or Die when reading this. Please.
            {
                0 =>
                {
                    new_pixel.r = *rgb_value;
                }

                1 =>
                {
                    new_pixel.g = *rgb_value;
                }

                2 =>
                {
                    new_pixel.b = *rgb_value;
                }

                _ =>
                {
                    println!("Went out of indexing for reading image to Vec<RGBStruct>");
                }
            }
        }

        unsafe {
            PIXELS.push(new_pixel);
            PIXEL_POSITIONS.push(new_pixel_position.clone());
        }

        let mut test_pixel_position = Position::from_pixel_position(new_pixel_position.clone());
        test_pixel_position.debug_dump();
    }

    process_pink_pixels();
    debug_perc();
}
