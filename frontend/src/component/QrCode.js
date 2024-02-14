import React from 'react';
import QRCode from 'react-qr-code';

const QrCode = () => {
    // URL to be encoded in the QR code
    const url = 'https://akshayachaitanya.org/donates/food-donation-online';

    return (
        <div>
            <h1 className='text-2xl font-bold p-2 items-center justify-center'>Scan to Donate</h1>
            <p className='p-2 items-center justify-center'>You have a chance today to change someone’s future, just by providing food.
                Don’t let it go.</p>
            <div className='flex m-4 items-center justify-center'>
                <QRCode value={url} />
            </div>
        </div>
    );
};

export default QrCode;
