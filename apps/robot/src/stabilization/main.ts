import { Vector, vector } from "vector";

function inverse_vector(input: Vector)
{
    let inverse = vector
    (
        input.x * -1,
        input.y * -1,
        input.z * -1
    )
    
    return inverse;
}