Membrane
========

A simple HTML5 viewer for each axis of an fMRI volume

Membrane is meant to be a simpler, lighter way to present fMRI volumes on a
webpage. Other solutions involve downloading and parsing the raw Nifti or DICOM
file. Membrane, instead, operates on video files, and seeks through them. These
videos are smaller than the originals, and the performance is generally much
better, as browsers natively understand video formats.

Membrane uses jQuery. To use Membrane, it's as simple as sourcing jQuery and
membrane.js, and then calling "fullyMonty()".

```
var desc = 'A description.';
var vid_array = { 'a':['X','x.mp4'], 'b':['Y','y.mp4'], 'c':['Z','z.mp4'] };
$('body').append(fullMonty(vid_array,desc));
```

And that's it. Also see example.html for more info.
