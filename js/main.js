import {createPhotos} from './data.js';
import {initThumbnails} from './thumbnails.js';
import {initUploadForm} from './form.js';

const data = createPhotos();
initThumbnails(data);
initUploadForm();
