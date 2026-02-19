/**
 * Compresses and resizes an image file using the browser's Canvas API.
 * Converts to WebP format with 0.8 quality.
 * Max dimension: 1920px.
 */
export async function compressImage(file: File): Promise<File> {
    // If not an image, return original
    if (!file.type.startsWith('image/')) return file

    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = URL.createObjectURL(file)
        img.onload = () => {
            const canvas = document.createElement('canvas')
            let width = img.width
            let height = img.height
            const maxDimension = 1920

            // Resize if too large
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width)
                    width = maxDimension
                } else {
                    width = Math.round((width * maxDimension) / height)
                    height = maxDimension
                }
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Canvas context not available'))
                return
            }

            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create new file with .webp extension
                        const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp"
                        const compressedFile = new File([blob], newName, {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        })
                        resolve(compressedFile)
                    } else {
                        reject(new Error('Compression failed'))
                    }
                    URL.revokeObjectURL(img.src)
                },
                'image/webp',
                0.8 // Quality
            )
        }
        img.onerror = (error) => {
            URL.revokeObjectURL(img.src)
            reject(error)
        }
    })
}
