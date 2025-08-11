document.addEventListener('DOMContentLoaded', () => {
            const pages = document.querySelectorAll('.story-page'); // Selecciona todas las páginas del cuento
            const prevButton = document.getElementById('prev-page');
            const nextButton = document.getElementById('next-page');
            let currentPageIndex = 0; // Índice de la página actual, comienza en la primera (0)

        async function generateAndDisplayImage() {
            const loadingIndicator = document.getElementById('loadingIndicator');
            const generatedImage = document.getElementById('generatedImage');
            const startButton = document.getElementById('startButton');

            loadingIndicator.classList.remove('hidden');
            generatedImage.classList.add('hidden');
            startButton.disabled = true; // Deshabilitar el botón mientras carga

            try {
                const userPrompt = "a lone person stands on an old wooden pier, looking out at a vast, moody ocean. In the distance, a large, antique sailing ship is barely visible through a light mist. The sky is overcast with dramatic lighting, conveying a sense of melancholy and adventure. realistic photo, wide shot, cinematic --ar 4:3";
                const payload = {
                    instances: { prompt: userPrompt },
                    parameters: { "sampleCount": 1 }
                };
                const apiKey = ""; // Canvas Runtime will inject the API key
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error generating image:", errorData);
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();

                if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
                    const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                    generatedImage.src = imageUrl;
                    generatedImage.onload = () => {
                        loadingIndicator.classList.add('hidden');
                        generatedImage.classList.remove('hidden');
                        startButton.disabled = false; // Habilitar el botón después de cargar
                    };
                    generatedImage.onerror = () => {
                        loadingIndicator.textContent = "Error al cargar la imagen. Intenta refrescar.";
                        console.error("Failed to load generated image.");
                        startButton.disabled = false; // Habilitar el botón incluso si falla la carga
                    };
                } else {
                    loadingIndicator.textContent = "No se obtuvo imagen. Intenta refrescar.";
                    console.error("Unexpected response structure or missing image data:", result);
                    startButton.disabled = false;
                }
            } catch (error) {
                console.error("Error en la generación de la imagen:", error);
                loadingIndicator.textContent = "Error al generar imagen.";
                startButton.disabled = false;
            }
        }

        // Event listener para el botón "Comenzar el Cuento"
        document.getElementById('startButton').addEventListener('click', () => {
            window.location.href = 'index.html'; // Redirige a la página principal del cuento
        });

        // Generar imagen al cargar la ventana
        window.onload = generateAndDisplayImage;

        loadingIndicator.style.display = 'flex';
        generatedImage.style.display = 'none';

            /**
             * Muestra la página especificada por el índice.
             * Oculta todas las demás páginas y actualiza el estado de los botones.
             * @param {number} index El índice de la página a mostrar.
             */
            function showPage(index) {
                // Asegurarse de que el índice esté dentro de los límites
                if (index < 0 || index >= pages.length) {
                    console.error("showPage: Índice de página fuera de límites:", index);
                    return;
                }

                // Ocultar todas las páginas
                pages.forEach(page => {
                    page.classList.remove('active');
                });

                // Mostrar la página activa
                pages[index].classList.add('active');
                currentPageIndex = index;

                // Actualizar el estado de los botones Siguiente/Anterior
                prevButton.disabled = currentPageIndex === 0; // Deshabilita "Anterior" en la primera página
                nextButton.disabled = currentPageIndex === pages.length - 1; // Deshabilita "Siguiente" en la última página
            }

            /**
             * Avanza a la siguiente página del cuento.
             */
            function nextPage() {
                if (currentPageIndex < pages.length - 1) {
                    showPage(currentPageIndex + 1);
                }
            }

            /**
             * Retrocede a la página anterior del cuento.
             */
            function prevPage() {
                if (currentPageIndex > 0) {
                    showPage(currentPageIndex - 1);
                }
            }

            // Asignar eventos a los botones
            prevButton.addEventListener('click', prevPage);
            nextButton.addEventListener('click', nextPage);

            // Mostrar la primera página al cargar el DOM
            showPage(currentPageIndex);
        });
        
        