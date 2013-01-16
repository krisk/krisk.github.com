$(function() {
  var list = ['Textualizer is a jQuery plug-in that allows you to transition through blurbs of text. Just like this...'
            ,'When transitioning to a new blurb, any character that is common to the next blurb is kept on the screen, and moved to its new position.'
            , 'Textualize: verb - to put into text, set down as concrete and unchanging.  Use Textualizer to transition through blurbs of text.'
            , 'Blurb: noun - a short summary or some words of praise accompanying a creative work.  A promotional description.'];

  var txt = $('#txtlzr');

  txt.textualizer(list, { duration: 3000 });
  txt.textualizer('start');
});