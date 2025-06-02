import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

type Item = {
    name: string;
    quantity: number;
    price: number;
};

export function ReceiptScanner() {
    const [text, setText] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const preprocessImage = (image: HTMLImageElement): HTMLCanvasElement => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Масштабирование для улучшения читаемости
        const scale = 2.0; // Увеличение в 2 раза
        canvas.width = image.naturalWidth * scale;
        canvas.height = image.naturalHeight * scale;

        // Применение фильтров: контраст, яркость, резкость
        ctx.filter = 'contrast(2.2) brightness(1.3) sharpen(1.5)';
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Бинаризация с адаптивным порогом
        for (let i = 0; i < data.length; i += 4) {
            const grayscale = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
            const threshold = grayscale > 180 ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = threshold;
        }

        // Медианный фильтр для удаления шума
        const tempData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {
                const i = (y * canvas.width + x) * 4;
                const neighbors = [
                    tempData.data[((y - 1) * canvas.width + x) * 4],
                    tempData.data[((y + 1) * canvas.width + x) * 4],
                    tempData.data[(y * canvas.width + (x - 1)) * 4],
                    tempData.data[(y * canvas.width + (x + 1)) * 4],
                ];
                const median = neighbors.sort((a, b) => a - b)[2];
                data[i] = data[i + 1] = data[i + 2] = median;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    };

    const cleanText = (text: string): string => {
        // Исправление типичных ошибок OCR
        return text
            .replace(/[θØ°O]/gi, '0')
            .replace(/©/gi, 'с')
            .replace(/4e/gi, 'че')
            .replace(/44й/gi, 'Чай')
            .replace(/Ow/gi, 'Ош')
            .replace(/0w/gi, 'Ош')
            .replace(/0/gi, '0')
            .replace(/е/gi, 'е')
            .replace(/о/gi, 'о')
            .replace(/\|/gi, '')
            .replace(/@/gi, '0')
            .replace(/,/g, '.'); // Замена запятой на точку для единообразия
    };

    function parseText (text: string) {
        const s1 = text.split('\n').map(l => l.trim()).filter(Boolean);
        const products: Item[] = []
        s1.forEach(s => {
            const s2 = s.split(' ').map(l => l.trim()).filter(Boolean);
            const product: Item = {
                name: '',
                price: 0,
                quantity: 0
            }

            console.log(s2)

            s2.forEach((s, i) => {
                if(i === s2.length - 1){
                    product.price = parseFloat(s.replace(',', '.'))
                }

                if(i === s2.length - 2){
                    product.quantity = parseFloat(s.replace(',', '.'))
                }

                if(i !== s2.length - 2 && i !== s2.length - 1){
                    product.name += s + ' '
                }
            })

            products.push(product)
        })

        console.log('products ', products)
        setItems(products)
    }

    const handleScan = async () => {
        if (!imageRef.current) {
            setError('Пожалуйста, загрузите изображение чека.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const canvas = preprocessImage(imageRef.current);
            const dataUrl = canvas.toDataURL('image/png');

            const worker = await Tesseract.createWorker('rus+eng')

            await worker.setParameters({
                // logger: (m: unknown) => console.log(m),
                tessedit_char_whitelist: '0123456789,.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ θØ',
                tessedit_pagesegmode: '4', // PSM 4: Предполагает один столбец текста
                tessedit_ocr_engine_mode: '1', // LSTM для лучшей точности
            })
            const { data } = await worker.recognize(dataUrl);

            const rawText = cleanText(data.text);
            parseText(rawText)
            setText(rawText);
            // const parsed = parseItems(rawText);
            // setItems(parsed);
        } catch (err) {
            console.error('Ошибка распознавания:', err);
            setError('Ошибка обработки чека. Проверьте четкость и освещение изображения.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Пожалуйста, загрузите файл изображения.');
                return;
            }
            setImageUrl(URL.createObjectURL(file));
            setText('');
            setItems([]);
            setError(null);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Сканер чеков</h2>

            <div className="flex flex-col items-center space-y-4">
                <label className="block">
                    <span className="text-gray-700">Выберите изображение чека</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </label>

                {imageUrl && (
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Чек"
                        className="max-w-full max-h-96 rounded-md border border-gray-300"
                    />
                )}

                <button
                    onClick={handleScan}
                    disabled={!imageUrl || loading}
                    className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                        !imageUrl || loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                >
                    {loading ? 'Обработка...' : 'Сканировать чек'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 p-4 rounded-md text-red-700">
                    <h3 className="font-semibold">Ошибка:</h3>
                    <p>{error}</p>
                </div>
            )}

            {text && (
                <div className="bg-gray-100 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-800 mb-2">Распознанный текст:</h3>
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">{text}</pre>
                </div>
            )}

            {items.length > 0 && (
                <div className="bg-green-100 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-800 mb-2">🧾 Найдено товаров:</h3>
                    <ul className="list-disc list-inside text-gray-700">
                        {items.map((item, i) => (
                            <li key={i}>
                                {item.name} — {item.quantity} шт × {item.price.toLocaleString('ru-RU', {
                                style: 'currency',
                                currency: 'UZS',
                            })}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}