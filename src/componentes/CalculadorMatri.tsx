import { useEffect, useState } from 'react';
import Button from './Button';
import { validateMatrix, validationsDimension } from './Validacion';
import './CalculadorMatri.css';

function MatrixCalculator() {
    /*El primer componente actualiza el segundo*/
    const [displayValue, setDisplayValue] = useState<string>('Prueba la calculadora');
    const [matrixA, setMatrixA] = useState<number[][]>([[0]]);
    const [matrixB, setMatrixB] = useState<number[][]>([[0]]);
    const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [dimensionMatrix, setDimensionMatrix] = useState<'unidimensional' | 'bidimensional' | 'tridimensional'>('unidimensional');

    const handleMatrixInput = (
        matrix: number[][],
        setMatrix: React.Dispatch<React.SetStateAction<number[][]>>,
        row: number,
        col: number,
        value: string
    ) => {
        //Se crea una copio de la matriz
        const newMatrix = matrix.map(r => [...r]);
        // Si el valor es vacío, se establece como cadena vacía en lugar de un número
        if (value === '') {
            newMatrix[row][col] = value as unknown as number; // Temporariamente permite un string vacío
        } else {
            newMatrix[row][col] = parseFloat(value); // Convertir a número solo si hay algo en value
        }

        setMatrix(newMatrix);
    };

    {/*Matriz A*/}
    const handleMatrixAInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixA, setMatrixA, row, col, value);
    };

    {/*Matriz B*/}
    const handleMatrixBInput = (row: number, col: number, value: string) => {
        handleMatrixInput(matrixB, setMatrixB, row, col, value);
    };

    // Lógica para actualizar las matrices cuando cambia la dimensión
    useEffect(() => {
        const defaultMatrix = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        setResultMatrix(null); // Limpiar también la matriz de resultados

    }, [dimensionMatrix]);

    const handClearClick = () => {
        setDisplayValue('Ingresa nuevamente tus valores');
        setOperator(null);
        
        // Reinicia las matrices A y B a ceros
        const defaultMatrix = dimensionMatrix === 'unidimensional'
            ? [[0]]
            : dimensionMatrix === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        
        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        setResultMatrix(null); // Limpiar la matriz de resultados
    };
    
    // Validar el cambio de dimensión usando Zod
    const handleDimensionChange = (dimension: string) => {
        const validation = validationsDimension.safeParse(dimension);

        if (!validation.success) {
            alert('Dimensión inválida. Selecciona una dimensión valida.');
            return;
        }

        const validDimension = validation.data;

        setDimensionMatrix(validDimension);
        const defaultMatrix = validDimension === 'unidimensional'
            ? [[0]]
            : validDimension === 'bidimensional'
                ? [[0, 0], [0, 0]]
                : [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        setMatrixA(defaultMatrix);
        setMatrixB(defaultMatrix);
        setResultMatrix(null);
    };


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

    const multiplyMatrices = (A: number[][], B: number[][]): number[][] => {
        const rowsA = A.length;
        const colsA = A[0].length;
        const rowsB = B.length;
        const colsB = B[0].length;

        // Verifica si la multiplicación es posible
        if (colsA !== rowsB) {
            throw new Error('El número de columnas de matrices A deben ser igual que el número de filas de la matrices B');
        }

        // Inicializa la matriz resultado
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


    function calculate() {
        if (operator === null) {
            alert('Selecciona tu operacion para calcular');
            return;
        }

        // Validar las matrices antes de calcular
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

        setResultMatrix(result);
        setOperator(null);
    }


    return (
        <div className='matrix-calculator'>
            <h2>CALCULADORA DE MATRICES</h2>
            <div className='display'>
                {/* Botones para seleccionar el tipo de matriz */}
                <div>
                    <Button value="Matriz Unidimencional" onClick={() => handleDimensionChange('unidimensional')} />
                    <Button value="Matriz Bidimencional" onClick={() => handleDimensionChange('bidimensional')} />
                    <Button value="Matriz Tridimencional" onClick={() => handleDimensionChange('tridimensional')} />
                </div>

                <h3>MATRIZ SELECCIONADA: {dimensionMatrix}</h3>

                {displayValue} {/*Mensaje de que ingrese nuevamente los valores*/}

                {/* Matriz A */}
                <div>
                    <h3>Matriz A</h3>
                    {/*Crea una copia de la matriz B*/}
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
                    {/*Crea una copia de la matriz B*/}
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

                {/* Botones para realizar operaciones 
                    Implementación de los props en los botones operacionales
                */}
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