import GifMock from './mock.js'

let Gif = window.Gif

if (process.env.NODE_ENV !== 'production') {
  Gif = window.Gif = new GifMock()
} else {
  if (!Gif) {
    throw new Error("[@mamba/native] 'Gif' module not found")
  }
}

export default Gif
