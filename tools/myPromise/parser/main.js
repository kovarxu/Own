$(function() {
  $('.parser-btn').click(function() {
    let val = $('.parser-input').val(), result = {};
    resetParser && resetParser();
    try {
      result = parse(val);
    } catch (e) {
      console.error('parse error !');
      return ;
    }
    console.log(result);
  })
})
