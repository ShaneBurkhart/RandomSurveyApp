$(function() {
  var answersContainer = $('.answers');
  var questionElement = $('h2#question');
  var canAnswer = true;

  var createAnswerElement = function(answer) {
    answerElement = $('<p>');
    answerElement.data('aid', answer.id);
    answerElement.html(answer.answer);
    return answerElement;
  };

  var createAnswersElements = function(answers) {
    answerElements= [];
    if(answers !== undefined) {
      for(var i = 0; i < answers.length; i++) {
        answerElements.push(createAnswerElement(answers[i]));
      }
    }
    return answerElements;
  };

  var updateDOMWithQuestion = function(question) {
    answersContainer.data('qid', question.id);
    questionElement.text(question.question);
    answersContainer.html(createAnswersElements(question.answers));
  };

  answersContainer.on('click', 'p', function(e) {
    if(!canAnswer) {
      return;
    }
    // We don't want the user to send multiple answers at once, so we
    // disable sending an answer until the request returns.
    canAnswer = false;
    answerId = $(e.target).data('aid');
    questionId = answersContainer.data('qid');

    $.post(
      '/question/' + questionId + '/answer',
      { answerId: answerId }
    ).done(function(data) {
      // Show a success message and show a new question
      var question = data.question;

      if(question !== null) {
        updateDOMWithQuestion(question);
      } else {
        // Show message saying we are out of questions.
      }
    }).fail(function() {
      // Show fail message
    }).always(function() {
      canAnswer = true;
    });
  });
});
