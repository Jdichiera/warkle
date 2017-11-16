var delay = 20;
var delayAJAX = delay * 10;
var dieRollStart =1;
var playing = true;

$(document).ready(function(){
    $(".diebutton").click(function(){
        var index = $(".diebutton").index(this);
        var die = $(this).attr("id");
     UpdateDieHeld(index, true);
     UpdateDiceBox(index);

    });

    $("#startbutton").click(function(){
        GameInit();
    });

    $("#rolldice").click(function(){
        RollDice();
    });

    $("#takescore").click(function(){
        AddToMainScore();
    });

    $("#resetdice").click(function(){
        $("#resetdice").addClass("hidden");
        $("#warkletext").addClass("hidden");
        $("#takescore").removeClass("hidden");
        $("#rolldice").removeClass("hidden");
        ResetDice();
    });

});

function AddToMainScore(){
    var rollingScore = parseInt($("#rollingscore").attr("data-value"));
    var currentScore = parseInt($("#score").attr("data-value"));
    var newScore = currentScore + rollingScore;
    $("#score").attr("data-value", newScore);
    $("#score").html(newScore);
    UpdateRollingScore(0);
    ResetDice();
    $("tr").removeClass("highlightscore info");

}

function UpdateScore(rollingPoints){
    var oldPoints = parseFloat($("#score").attr("data-value"));
    var newscore = oldPoints + points;
    if(newscore > -1){
        if($("#rollingscore").hasClass("greentext")){
           
        } else {
            $("#rollingscore").removeClass("redtext");
            $("#rollingscore.redtext").addClass("greentext");
        }
       
    } else if(newscore < 0) {
        if($("#rollingscore").hasClass("redtext")){
           
        } else {
            $("#rollingscore").removeClass("greentext");
            $("#rollingscore").addClass("redtext");
        }
    }
    UpdateRollingScore(newScore);
}

function UpdateRollingScore(newScore){
    $("#rollingscore").attr("data-value", newScore);
    $("#rollingscore").html(newScore);
}

function GameInit(){
    $("#startbutton").addClass("hidden");
    $(".diebutton").removeClass("hidden");
    $("#rolldice").removeClass("hidden");
    $("#takescore").removeClass("hidden");
    UpdateRollingScore(0);
    ResetDice();
}

function ResetDice(){
    for(var i = 0; i < 6; i ++){
        var die = $(".diebutton").eq(i);
        var dieImage = $(".diebutton img").eq(i);
        var rollDiceBox = $("#rollbox");
        die.attr("data-held", false);
        die.attr("data-value", 1);
        dieImage.attr("src", "/images/dieface1.png");
        rollDiceBox.append(die);
    } 
    $("tr").removeClass("highlightscore info");
    UpdateRollingScore(0);
    RollDice();
}

function UpdateDieImage(index, imageString){
    var $dieImage = $("#rollbox .diebutton img").eq(index);
    $dieImage.attr("src","/images/" + imageString);
}

function UpdateDieValue(index, value){
    var $dieValue = $("#rollbox .diebutton").eq(index);
    $dieValue.attr("data-value", value);
}

function UpdateDieHeld(index, held){
    var $die = $("#rollbox .diebutton").eq(index);
    var currentStatus = $die.attr("data-held");
    if(currentStatus == "false"){
        $die.attr("data-held", held); 
    }
}

function UpdateDiceBox(index){
    var die = $("#rollbox .diebutton").eq(index);
    var heldDiceBox = $("#holdbox");
    currentStatus = die.attr("data-held");
    if(currentStatus == "true"){
        heldDiceBox.append(die);
    }
    SortDiceElements();
    ScoreDice();
}

function SortDiceElements(){
    var heldDiceBox = $("#holdbox");
    var heldDice = $("#holdbox .diebutton");
    heldDice.sort(function(a, b){
        var avalue = a.getAttribute("data-value");
        var bvalue = b.getAttribute("data-value");
        
        if(avalue > bvalue){
            return 1;
        }
        if(avalue < bvalue){
            return -1;
        }
        return 0;
    });
    heldDice.appendTo(heldDiceBox);
}

function RollDice(){
    for(var i = 0; i < $("#rollbox .diebutton").length; i++){
        $("#rollbox .diebutton").eq(i).addClass("rolldiceanimation");
        var data = GetDieJSON(i);
    }
    setTimeout( function(){
        CheckWarkle();
    },800);
  
    
}

function GetDieJSON(index) {
    var allData = [];
        var url = "http://jdichieradiceapi.azurewebsites.net/api/die";
        $.ajax({
            url: url,
            type: "GET",
            cache: false,
            success: function(data){
                setTimeout( function(){
                    UpdateDieImage(index, data.image);
                    UpdateDieValue(index, data.face);
                    UpdateDieHeld(index, data.held);
                    $("#rollbox .diebutton").eq(index).removeClass("rolldiceanimation");
                 }, delayAJAX);
            },
            error: function(){
                $("#" + dieId + "json").html("error");
            }
        });
    }

function GetAllDiceJSON() {
        var numberToRoll = $("#rollbox .diebutton").length;
        var url = "http://jdichieradiceapi.azurewebsites.net/api/diceset/" + numberToRoll;
        $.ajax({
            url: url,
            type: "GET",
            cache: false,
            success: function(data){
                setTimeout( function(){
                    for(i = 0; i < data.length; i++){
                        var dieId = "die" + data[i]["id"];
                        var dieFace = data[i]["face"];
                        var dieImage = data[i]["image"];
                        var dieHeld = data[i]["held"];
                        UpdateDieImage(i, dieImage);
                        UpdateDieValue(i, dieFace);
                        UpdateDieHeld(i, dieHeld);
                    }
                 }, delayAJAX);
                 

            },
            error: function(){
                $("#" + dieId + "json").html("error");
            }
        });
        
    }

function CheckWarkle(){
    var rolledWarkle = true;
    for(var i = 0; i < $("#rollbox .diebutton").length; i++){
        var diceValue = $("#rollbox .diebutton").eq(i).attr("data-value");
        if(diceValue == "1" || diceValue == "5"){
            rolledWarkle = false;
        }
    }
    if(rolledWarkle){

        $("#title").removeClass("warkleanimation");
        setTimeout(function(){
            $("#title").addClass("warkleanimation");
        }, 5);

        $("#rolldice").addClass("hidden");
        $("#takescore").addClass("hidden");
        $("#resetdice").removeClass("hidden");
        $("#warkletext").removeClass("hidden");
    }
}

function ScoreDice(){
    var groupedDice = GroupDice();
    var runningScore = 0;
    runningScore = CheckStraight(groupedDice);
    if(runningScore == 0){
        for(var i = 0; i < 6; i++){
            runningScore += CheckForScore(groupedDice, i+1);
        }
    }
    UpdateRollingScore(runningScore);
}

function CheckStraight(groupedDice){
    var die = $("#holdbox .diebutton");
    var score = 0;
    var count = 0;
    for(var number in groupedDice){
        if(groupedDice[number] == 1){
            count++;
        }
    }
    if(count == 6){
        score = 1000;
        $(".highlightscore, .info").removeClass("highlightscore info");
        $("#straight").addClass("highlightscore info");
        
    }
    return score;
}

function GroupDice(){
    //TODO: Update 5s calculation
    var groupedDice = {};
    var number;
    $("#holdbox .diebutton").each(function(i, el){
        number = $(el).attr("data-value");

        if(groupedDice.hasOwnProperty(number)){

            groupedDice[number] += 1;
        } else {

            groupedDice[number] = 1;
        }
    });
    return groupedDice;
}

function CheckForScore(groupedDice, numberToCheck){
    var score = 0;
    var totalInGroup;

    for(var number in groupedDice){
        if(number == numberToCheck){
            totalInGroup = groupedDice[number];
            if(totalInGroup <= 2){
                if(numberToCheck == 1){
                    score += (totalInGroup % 3) * 100;
                    $("#ones").removeClass("highlightscore info");
                    $("#ones").addClass("highlightscore info");
                }
                if(numberToCheck == 5){
                    score += (totalInGroup % 3) * 50;
                    $("#fives").removeClass("highlightscore info");
                    $("#fives").addClass("highlightscore info");
                }

            }

            if(totalInGroup >= 3){
                if(numberToCheck == 1){
                    $("#ones").removeClass("highlightscore info");
                    $("#triple1").addClass("highlightscore info");
                    score = 1000;
                    score += (totalInGroup % 3) * 100;
                    if(score > 1000){
                    $("#ones").addClass("highlightscore info");
                    }
                }
                else{
                    $("#triple" + numberToCheck).addClass("highlightscore info");
                    score = 100 * numberToCheck;
                }
            }
            if(totalInGroup == 6){
                if(numberToCheck == 1){
                    score = 2000;
                    $("#ones, #triple1").removeClass("highlightscore info");
                    $("#doubletriple1").addClass("highlightscore info");
                }
                else{
                    score = (100 * numberToCheck) * 2;
                }
            }
        }
    }
    return score
}

function UpdateDiagnostics(){
    for(var i = 0; i < 6; i ++){
        var die = $(".diebutton").eq(i);
        var dieId = "die" + (i + 1);
        var dieImage = $(".diebutton img").eq(i).attr("src");
        var dieFace = die.attr("data-value");
        var dieHeld = die.attr("data-held");

        $("#" + dieId + "json").html("Image: " + dieImage + " || Value: " + dieFace + " || Held: "+ dieHeld);
    }
}

function SetDice(number1, number2, number3, number4, number5, number6 ){
    var numbers = [number1, number2, number3, number4, number5, number6];
    console.log(numbers);
    for(var i = 0; i < 6; i ++){
        var die = $(".diebutton").eq(i);
       $(".diebutton img").eq(i).attr("src", "/images/dieFace" + numbers[i] + ".png");
        var dieFace = die.attr("data-value", numbers[i]);
    }
}
function GameOver(){
    $("#gameover").modal();
}