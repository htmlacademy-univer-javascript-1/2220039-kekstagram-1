import { createPhotosArray } from './data.js';
import { createThumbnails } from './thumbnails.js';

const data = createPhotosArray();
createThumbnails(data);
