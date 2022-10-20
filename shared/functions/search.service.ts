import axios from "axios";

export interface PixabayResponse {
    total: number
    totalHits: number
    hits: {
        collections: number
        comments: number
        downloads: number
        id: number
        imageHeight: number
        imageSize: number
        imageWidth: number
        largeImageURL: string
        likes: number
        pageURL: string
        previewHeight: number
        previewURL: string
        previewWidth: number
        tags: string
        type: "photo"
        user: string
        userImageURL: string
        user_id: number
        views: number
        webformatHeight: number
        webformatURL: string
        webformatWidth: number
    }[]
}

export const searchImages: (query: string, page: number, size: number) => Promise<PixabayResponse | void> = async (query: string, page: number, size: number) => await axios.get(
    'https://pixabay.com/api/',
    {
        params: {
            key: '30538748-bac22a4d78aa0d6b1174e33dd',
            q: query,
            page: page,
            per_page: size
        }
    }
).then((res) => {
    if(res.status === 200) {
        return res.data
    } else {
        throw new Error('Request error ' + res.status)
    }
}).catch(e => console.error(e))
