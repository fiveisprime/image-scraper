var scraper = require('scraper')
  , fs      = require('fs')
  , path    = require('path')
  , http    = require('http');

//
// Set the url to find images from here.
//
var url = process.argv[2] || 'http://nodejs.org';

scraper(url, function(err, $) {
  if (err) throw err;

  $('img').each(function(index, image) {
    var src = $(image).attr('src')
      , imagePath = index + src.substring(src.lastIndexOf('/') + 1, src.length)
      , file = fs.createWriteStream(path.join('./images', imagePath));

    file.on('finish', function() { file.close(); });

    if (src.indexOf('http') === -1) src = url + '/' + src;

    console.log('saving %s >> %s', src, imagePath);

    http.get(src, function(response) {
      response.pipe(file);
    });
  });
});
