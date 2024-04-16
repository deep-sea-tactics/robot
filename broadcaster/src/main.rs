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
        }
    }

    //TODO: Operator overload
    fn difference(&self, against: RGBStruct) -> RGBStruct
    {
        let mut res = self.clone();
        
        //FIXME: Efficient-ify the process of unsigned subtraction
        if res.r > against.r
        {
            res.r -= against.r;
        }
        else
        {
            res.r = 0;
        }
        
        if res.g > against.g
        {
            res.g -= against.g;
        }
        else
        {
            res.g = 0;
        }

        if res.b > against.b
        {
            res.b -= against.b;
        }
        else
        {
            res.b = 0;
        }

        res
    }

    fn to_scalar(&self) -> u32
    {
        let mut res: u32 = 0;

        res += self.r as u32;
        res += self.g as u32;
        res += self.b as u32;

        res
    }

    fn perc_diff(&self, against: RGBStruct) -> f32
    {
        let res: f32;

        let against_diff: RGBStruct = self.difference(against);
        let scale: u32 = against_diff.to_scalar();

        let perc: f32 = scale as f32/100.0;

        res = clamp(perc, 0.0, 1.0);

        res
    }

    fn debug_dump(&self) -> ()
    {
        println!("R: {}", self.r);
        println!("G: {}", self.g);
        println!("B: {}", self.b);
    }
}

const PINK: RGBStruct = RGBStruct{r: 255, g: 0, b: 240};

static mut PROCESSED_PIXELS: Vec<RGBStruct> = vec![];

fn main()
{
    let image = ImageReader::open("/workspace/robot/broadcaster/pink.jpeg")
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
            PROCESSED_PIXELS.push(new_pixel);
        }
    }

    unsafe
    {
        for item in PROCESSED_PIXELS.iter()
        {
            println!("{}", item.perc_diff(PINK));
        }
    }
}