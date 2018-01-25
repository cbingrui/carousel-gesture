import { getJSON } from './utility';
export default function fetchImageUrls(pageIndex, callback = null) {
  getJSON(
    'http://lab.busydoor.net:3000/gallery',
    // 'http://lab.mylocalhost.test:3000/gallery',

    data => {
      // data is an array with images url: `["https://cdn.pixabay.com/photo/2018/01/19/14/40/nature-3092555__340.jpg","https://cdn.pixabay.com/photo/2018/01/18/19/06/time-3091031__340.jpg"]`
      !callback || callback(data);
    },
    function(err) {
      console.error(err);
    },
    { page_index: pageIndex }
  );
}
