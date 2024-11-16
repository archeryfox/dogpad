import React from 'react';
import Compressor from 'compressorjs';

const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.1,  // Уменьшение качества до 25%
            success(result) {
                resolve(result);
            },
            error(err) {
                reject(err);
            }
        });
    });
};

const SpeakerProfile = ({speaker}) => {
    const handleImageLoad = async () => {
        const imageFile = await fetch(speaker.avatar).then((res) => res.blob());
        const compressedImage = await compressImage(imageFile);
        // Устанавливаем URL для изображения
        document.getElementById('speaker-avatar').src = URL.createObjectURL(compressedImage);
    };
    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <div className="flex items-center mb-4">
                <img
                    id="speaker-avatar"
                    src={speaker.avatar}
                    alt={speaker.name}
                    onLoad={handleImageLoad}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                    <h2 className="text-2xl font-bold">{speaker.name}</h2>
                    <p className="text-gray-500">{speaker.biography}</p>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold">Запросы на изменение роли:</h3>
                {speaker?.RoleChangeRequest?.length > 0 ? (
                    <ul className="list-disc pl-5 mt-2">
                        {speaker?.RoleChangeRequest.map(request => (
                            <li key={request.id} className="mt-2">
                                <span className="font-semibold">Запрашиваемая роль:</span> {request?.requestedRoleId}
                                <br/>
                                <span className="font-semibold">Статус:</span> {request.status}
                                <br/>
                                <span className="text-sm text-gray-500">
                                    ({new Date(request?.createdAt).toLocaleString()})
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Нет запросов на изменение роли.</p>
                )}
            </div>
        </div>
    );
};

export default SpeakerProfile;
