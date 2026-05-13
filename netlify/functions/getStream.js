exports.handler = async (event) => {
    const origin = event.headers.origin || event.headers.referer;
    // This blocks people trying to steal your link for their own sites
    if (!origin || !origin.includes("freeterabox.netlify.app")) {
        return { statusCode: 403, body: "Access Denied" };
    }

    // This pulls your key from the Netlify safe
    const API_KEY = process.env.MY_TERA_KEY; 

    try {
        const { link } = JSON.parse(event.body);
        const response = await fetch('https://terabox-downloader-api2.p.rapidapi.com/v1', {
            method: 'POST',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'terabox-downloader-api2.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ platform: "terabox", media_type: "video", quality: "auto", link: link })
        });
        const data = await response.json();
        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (e) {
        return { statusCode: 500, body: "Error" };
    }
};
