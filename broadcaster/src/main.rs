use std::io::Cursor;
use image::io::Reader as ImageReader;

//#FF00F0 is the pink color used for testing.

fn main()
{
    let image = ImageReader::open("/workspace/robot/broadcaster/pink.jpeg")
        .expect("Failed to open file.")
        .decode();

    let rgb_image = image.unwrap().to_rgb8();

    for (index,pixel) in rgb_image.pixels().enumerate()
    {
        for (val_i,rgb_value) in pixel.0.iter().enumerate()
        {
            println!("{}", rgb_value);
        }
    }
}