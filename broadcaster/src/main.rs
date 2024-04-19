use std::io::Cursor;
use image::io::Reader as ImageReader;
use num::clamp;
/*
#FF00F0 is the pink color used for testing.
This is 255, 0, 240 in RGB. Note: The image library has decided that the color of the test images is 255, 0, 240.

Note: A lot of this is just boilerplate code. 
The plan is to test all the pixels in an image against the pink color and deduce that the 'most pink' parts of the image are the pink square.

This could probably be more efficient. We could probably have just used a different library, but I don't know what I'm doing TM (so I'm improvising :) ).
*/

#[derive(Clone)]
struct RGBStruct
{
    r: u8,
    g: u8,
    b: u8,
    is_pink: bool,
}
impl RGBStruct
{
    fn new(r: u8, g: u8, b: u8) -> RGBStruct
    {
        RGBStruct
        {
            r: r,
            g: g,
            b: b,
            is_pink: false,
        }
    }

    //TODO: Operator overload
    fn difference(&self, against: RGBStruct) -> RGBStruct
    {
        let mut res = RGBStruct::new(0,0,0);

        res.r = difference_of_rgb_value(self.r, against.r);
        res.g = difference_of_rgb_value(self.g, against.g);
        res.b = difference_of_rgb_value(self.b, against.b);

        res
    }

    fn to_scalar(&self) -> u16
    {
        let mut res: u16 = 0;

        res += self.r as u16;
        res += self.g as u16;
        res += self.b as u16;

        res
    }

    fn perc_diff(&self, against: RGBStruct) -> f32
    {
        let res: f32;

        let against_diff: RGBStruct = self.difference(against);
        let scale: u16 = against_diff.to_scalar();

        let perc: f32 = scale as f32/100.0;

        res = clamp(perc, 0.0, 1.0);

        res
    }

    fn debug_dump(&self) -> ()
    {
        println!("R: {}", self.r);
        println!("G: {}", self.g);
        println!("B: {}", self.b);
        println!("Is pink? {}", self.is_pink);
    }
}

const PINK_SQUARE_OUT_OF_FRAME_MIN: f32 = 0.1;
const IS_PINK_DEVIANT: f32 = 0.1;
const PINK: RGBStruct = RGBStruct{r: 255, g: 0, b: 240, is_pink: true};

static mut PIXELS: Vec<RGBStruct> = vec![];
static mut PINK_PIXELS: Vec<&RGBStruct> = vec![];

fn difference_of_rgb_value(target: u8, against: u8) -> u8
{
    let res: u8 = (target as i16 - against as i16).abs() as u8;
    
    res
}

fn process_pink_pixels() -> ()
{
    unsafe
    {
        for pixel in PIXELS.iter()
        {
            let pink_perc = pixel.perc_diff(PINK);

            if pink_perc < PINK_SQUARE_OUT_OF_FRAME_MIN
            {
                pixel.to_owned().is_pink = true;
                PINK_PIXELS.push(&pixel);
            }
        }
    }
}

fn debug_perc() -> ()
{
    unsafe
    {
        let res: f32 = (PINK_PIXELS.len() as f32/PIXELS.len() as f32);

        println!("Percent of pink pixels in image (0 to 1): {res}");
        println!("Pink pixel count: {}", PINK_PIXELS.len());
        println!("Total pixel count: {}", PIXELS.len());
    }
}

fn main()
{
    let image = ImageReader::open("/workspace/robot/broadcaster/kittens_and_pink_square.jpeg")
        .expect("Failed to open file.")
        .decode();

    let rgb_image = image.unwrap().to_rgb8();
    
    for (index,pixel) in rgb_image.pixels().enumerate()
    {
        let mut new_pixel = RGBStruct::new(0,0,0);

        for (val_i,rgb_value) in pixel.0.iter().enumerate()
        {
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

        unsafe
        {
            PIXELS.push(new_pixel);
        }
    }

    process_pink_pixels();
    debug_perc();
}