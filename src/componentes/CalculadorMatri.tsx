import { useEffect, useState } from 'react';
import Button from './Button';
import { validateMatrix, validationsDimension } from './Validacion';
import './CalculadorMatri.css';

function MatrixCalculator() {

    const [displayValue, setDisplayValue] = useState<string>('Prueba la calculadora'); /* Define el estado inicial del componente usando hooks */
    const [matrixA, setMatrixA] = useState<number[][]>([[0]]); // Matriz A inicializada con un valor por defecto [[0]]
    const [matrixB, setMatrixB] = useState<number[][]>([[0]]); // Matriz B inicializada con un valor por defecto [[0]]
    const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null); // Matriz de resultados, puede ser null o una matriz de números
    const [operator, setOperator] = useState<string | null>(null); // Operador matemático seleccionado (null si no se ha seleccionado ninguno)
    const [dimensionMatrix, setDimensionMatrix] = useState<'unidimensional' | 'bidimensional' | 'tridimensional'>('unidimensional'); // Dimensión de la matriz seleccionada ('unidimensional', 'bidimensional', 'tridimensional')

    /* Maneja la entrada de datos en una matriz */
    const handleMatrixInput = (
        matrix: number[][], // Matriz a actualizar
        setMatrix: React.Dispatch<React.SetStateAction<number[][]>>, // Función para actualizar la matriz
        row: number, // Fila en la matriz
        col: number, // Columna en la matriz
        value: string // Valor ingresado
    ) => {
        // Crea una copia de la matriz para evitar mutaciones directas
        const newMatrix = matrix.map(r => [...r]);
        // Si el valor es vacío, se establece como cadena vacía en lugar de un número
        if (value === '') {
            newMatrix[row][col] = value as unknown as number; // Temporariamente permite un string vacío
        } else {
            // Convierte el valor a número si no está vacío
            newMatrix[row][col] = parseFloat(value);
        }
        // Actualiza el estado de la matriz
        setMatrix(newMatrix);
    };

    /* Maneja la entrada de datos en la Matriz A */
    const handleMatrixAInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixA, setMatrixA, row, col, value);
    };

    /* Maneja la entrada de datos en la Matriz B */
    const handleMatrixBInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixB, setMatrixB, row, col, value);
    };

    /* Actualiza las matrices y el estado cuando cambia la dimensión */
    useEffect(() => {
        // Define la matriz por defecto basada en la dimensión seleccionada
        const defaultMatrix = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        // Actualiza las matrices A y B con la matriz por defecto
        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        // Limpia la matriz de resultados
        setResultMatrix(null);

    }, [dimensionMatrix]); // Dependencia: se ejecuta cuando cambia dimensionMatrix

    /* Maneja el clic en el botón "AC" (borrar) */
    const handClearClick = () => {
        // Resetea el mensaje de visualización
        setDisplayValue('Ingresa nuevamente tus valores');
        // Resetea el operador seleccionado
        setOperator(null);
        
        // Reinicia las matrices A y B a ceros basándose en la dimensión seleccionada
        const defaultMatrix = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        
        // Actualiza las matrices A y B con la matriz por defecto
        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        // Limpia la matriz de resultados
        setResultMatrix(null);
    };
    
    /* Maneja el cambio de dimensión de la matriz */
    const handleDimensionChange = (dimension: string) => {
        // Valida la dimensión usando una función de validación externa (Zod en este caso)
        const validation = validationsDimension.safeParse(dimension);

        if (!validation.success) {
            // Muestra un mensaje de error si la dimensión no es válida
            alert('Dimensión inválida. Selecciona una dimensión valida.');
            return;
        }

        // Establece la dimensión válida
        const validDimension = validation.data;

        // Actualiza el estado de la dimensión de la matriz
        setDimensionMatrix(validDimension);
        // Define la matriz por defecto basada en la dimensión válida
        const defaultMatrix = validDimension === 'unidimensional'
            ? [[0]]
            : validDimension === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        // Actualiza las matrices A y B con la matriz por defecto
        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        // Limpia la matriz de resultados
        setResultMatrix(null);
    };

    /* Aplica una operación matemática entre dos números */
    const applyOperation = (a: number, b: number, operator: string): number => {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                return a / b;
            default:
                throw new Error('Operador no válido');
        }
    };

    /* Multiplica dos matrices */
    const multiplyMatrices = (A: number[][], B: number[][]): number[][] => {
        const rowsA = A.length;
        const colsA = A[0].length;
        const rowsB = B.length;
        const colsB = B[0].length;

        // Verifica si la multiplicación es posible (número de columnas de A debe igualar número de filas de B)
        if (colsA !== rowsB) {
            throw new Error('El número de columnas de matrices A deben ser igual que el número de filas de la matrices B');
        }

        // Inicializa la matriz resultado con ceros
        const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

        // Calcula la multiplicación de matrices
        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                for (let k = 0; k < colsA; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }

        return result;
    };

    /* Calcula el resultado basado en el operador seleccionado y las matrices */
    function calculate() {
        // Verifica si se ha seleccionado un operador
        if (operator === null) {
            alert('Selecciona tu operacion para calcular');
            return;
        }

        // Valida las matrices antes de calcular
        const matrixAValidation = validateMatrix(matrixA);
        const matrixBValidation = validateMatrix(matrixB);

        if (!matrixAValidation.success) {
            console.error(`Error en Matriz A: ${matrixAValidation.error.issues.map((issue: { message: unknown; }) => issue.message).join(', ')}`);
            return;
        }

        if (!matrixBValidation.success) {
            console.error(`Error en Matriz B: ${matrixBValidation.error.issues.map((issue: { message: unknown; }) => issue.message).join(', ')}`);
            return;
        }

        let result: number[][];

        // Calcula el resultado basado en la dimensión de la matriz y el operador
        switch (dimensionMatrix) {
            case 'unidimensional':
                if (operator === '*') {
                    // Multiplicación de vectores (unidimensional)
                    result = matrixA.map((value, i) =>
                        [applyOperation(value[0], matrixB[i][0], operator!)]
                    );
                } else {
                    result = matrixA.map((row, i) =>
                        row.map((_, j) =>
                            applyOperation(matrixA[i][j], matrixB[i][j], operator!)
                        )
                    );
                }
                break;

            case 'bidimensional':
                if (operator === '*') {
                    result = multiplyMatrices(matrixA, matrixB);
                } else {
                    result = matrixA.map((row, i) =>
                        row.map((_, j) =>
                            applyOperation(matrixA[i][j], matrixB[i][j], operator!)
                        )
                    );
                }
                break;

            case 'tridimensional':
                alert('Esa tridimensionalidad de matrices no está implementada');
                return;

            default:
                throw new Error('Dimensión no apta');
        }

        // Actualiza el estado con el resultado y resetea el operador
        setResultMatrix(result);
        setOperator(null);
    }

    // Renderiza el componente
    return (
        <div className='matrix-calculator'>
            <h2>CALCULADORA DE MATRICES</h2>
            <div className='display'>
                {/* Botones para seleccionar el tipo de matriz */}
                <div>
                    <Button value="Matriz Unidimensional" onClick={() => handleDimensionChange('Unidimensional')} />
                    <Button value="Matriz Bidimensional" onClick={() => handleDimensionChange('Bidimensional')} />
                    <Button value="Matriz Tridimensional" onClick={() => handleDimensionChange('Tridimensional')} />
                </div>

                <h3>MATRIZ SELECCIONADA: {dimensionMatrix}</h3>

                {/* Mensaje que indica que ingrese nuevamente los valores */}
                {displayValue}

                {/* Matriz A */}
                <div>
                    <h3>Matriz A</h3>
                    {/* Mapea cada fila y columna de la matriz A a un input */}
                    {matrixA.map((row, i) => (
                        <div key={i}>
                            {row.map((value, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    value={isNaN(value) ? '' : value}
                                    onChange={(e) => handleMatrixAInput(i, j, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Matriz B */}
                <div>
                    <h3>Matriz B</h3>
                    {/* Mapea cada fila y columna de la matriz B a un input */}
                    {matrixB.map((row, i) => (
                        <div key={i}>
                            {row.map((value, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    value={isNaN(value) ? '' : value}
                                    onChange={(e) => handleMatrixBInput(i, j, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Botones para realizar operaciones */}
                <Button value="Matriz A + Matriz B" onClick={() => setOperator('+')} />
                <Button value="Matriz A - Matriz B" onClick={() => setOperator('-')} />
                <Button value="Matriz A * Matriz B" onClick={() => setOperator('*')} />
                <Button value="Matriz A / Matriz B" onClick={() => setOperator('/')} />
                <Button value="=" onClick={calculate} />
                <Button value="AC" onClick={handClearClick} />

                {/* Resultado */}
                {resultMatrix && (
                    <div>
                        <h3>RESULTADO</h3>
                        {/* Mapea cada fila y columna del resultado a un div */}
                        {resultMatrix.map((row, i) => (
                            <div key={i}>
                                {row.map((value, j) => (
                                    <div key={j}>{value}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MatrixCalculator;
