import { z } from "zod";

// Validación para una matriz de números (de cualquier dimensión)
const matrixSchema = z.array(z.array(z.number())).nonempty().refine(
    (matrix) => matrix.every(row => row.length === matrix[0].length),
    { message: "Todas las filas deben tener el mismo número de columnas" }
);

export const validateMatrix = (matrix: number[][]) => {
    return matrixSchema.safeParse(matrix);
};

export const validationsDimension = z.enum(['unidimensional', 'bidimensional', 'tridimensional']);