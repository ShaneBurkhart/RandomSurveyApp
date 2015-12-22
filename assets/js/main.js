$(function() {
  var answersFormContainer = $('#answers-form-container');
  var addAnswerButton = $('#add-answer');

  addAnswerButton.click(function(e) {
    e.preventDefault();
    var lastAnswerLabel = answersFormContainer.find('label').last();
    var nextAnswerNum = parseInt(lastAnswerLabel.text().trim().slice(-1)) + 1;
    var nextAnswerIndex = nextAnswerNum - 1;

    if(!nextAnswerNum) {
      return;
    }

    answersFormContainer.append([
      '<label for="question[answers][' + nextAnswerIndex + '][answer]">',
        'Answer ' + nextAnswerNum,
      '</label>',
      '<input name="question[answers][' + nextAnswerIndex + '][answer]" type="text">',
      '</input>'
    ].join(""));
  });


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

  var showNoQuestionsMessage = function() {
    answersContainer.empty();
    questionElement.text('There aren\'t anymore survey questions.');
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
      // Show a new question
      var question = data.question;

      if(question !== null) {
        updateDOMWithQuestion(question);
      } else {
        showNoQuestionsMessage();
      }
    }).fail(function() {
      alert('There was a problem when submitting your answer.  Please try again later.');
    }).always(function() {
      canAnswer = true;
    });
  });
});
