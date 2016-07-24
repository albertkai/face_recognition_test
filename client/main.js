import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore'
import 'tracking/build/tracking-min.js'
import 'tracking/build/data/eye-min.js'
import 'tracking/build/data/face-min.js'
import 'tracking/build/data/mouth-min.js'

import './main.html';

const limit = 30;
const startId = 100;

window.plot = function(x, y, w, h, img) {
  var rect = document.createElement('div');
  img.parentElement.appendChild(rect);
  rect.classList.add('rect');
  rect.style.width = w + 'px';
  rect.style.height = h + 'px';
  rect.style.left = (img.offsetLeft + x) + 'px';
  rect.style.top = (img.offsetTop + y) + 'px';
};

Template.faces.onRendered(function(){

  $('img').load(function(){
    const selector = '#' + $(this).attr('id');
    const img = $(this).get(0);
    const tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
    tracker.on('track', function(event) {
      event.data.forEach(function(rect) {
        window.plot(rect.x, rect.y, rect.width, rect.height, img);
      });
    });
    tracking.track(selector, tracker);
  })

})

Template.faces.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  avatars() {
    return _.range(0, limit).map((i) => {
      return {
        url: `http://graph.facebook.com/${ startId + i }/picture/?type=large`,
        id: 'img' + i
      }
    });
  }
});
