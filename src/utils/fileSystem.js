const fs = require('fs')
const path = require('path')

exports.createDir = async (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) return reject(err)
            else resolve()
        })
    })
}


exports.removeDir = async (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.rmdir(dirPath, { recursive: true }, (err) => {
            if (err) reject('Произошла ошибка при удалении директории')
            resolve('Директория успешно удалена')
        })
    })
}


exports.removeFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, function (err) {
            if (err) reject(err);
            resolve('Файл успешно удалён')
        });
    })
}


exports.findJson = async (dirPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            try {
                files.forEach(file => {
                    if (path.extname(file) === '.json') resolve(file)
                })
                reject('Json файл не найден')
            } catch (e) {
                console.log(e)
                reject('Json файл не найден')
            }
        })
    })
}


exports.findJsonRecursive = async (dirPath) => {
    return new Promise((resolve, reject) => {
        const walk = async (recDirPath) => {
            fs.readdir(recDirPath, (err, files) => {
                try {
                    files.forEach(file => {
                        fs.stat(`${recDirPath}/${file}`, (err, stat) => {
                            if (stat.isDirectory()) walk(`${recDirPath}/${file}`)
                            else if (path.extname(file) === '.json' && recDirPath.includes('Build')) {
                                let result = `${recDirPath}/${file}`.substring(10)
                                resolve(result)
                            }
                            else console.log('no entries')
                        })
                    })
                } catch (e) {
                    reject('Json файл не найден')
                }
            })
        }
        walk(dirPath)
    })
}


exports.readFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject('Ошибка при чтении json файла')
            const result = JSON.parse(data)
            resolve(result)
        })
    })
}


exports.extractArchive = async (archivePath) => {
    const directory = await unzipper.Open.file(archivePath);
    return new Promise((resolve, reject) => {
        directory.files[0]
            .stream()
            .pipe(fs.createWriteStream('firstFile'))
            .on('error', reject())
            .on('finish', resolve())
    })
}