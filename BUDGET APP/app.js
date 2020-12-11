//BUDGET CONTROLLER

var budgetController= (function(){
    
    var Expense = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
        
    };
    Expense.prototype.calcpercentage=function(totalIncome){
        if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage=-1;
        }
    };
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    };
    
    
    
    
      var Income = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        
    };
    
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.totals[type]=sum;
    };
    
    var data ={
        allItems:{
            exp:[],
            inc:[],
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };
    
    return{
        addItem:function(type,des,val){
            var newItem,ID;
            
            
            //create new ID
            if (data.allItems[type].length>0){
            ID = data.allItems[type][data.allItems[type].length-1].id+1;
            }else {
                ID=0;
            }
            //create new item based on inc or exp tye
            if (type==='exp'){
                newItem =new Expense(ID,des,val);
            }else if(type==='inc'){
                newItem=new Income(ID,des,val);
            }
            
            //push it into our data structure
            data.allItems[type].push(newItem);
            
            //return the new element
            return newItem;
            
        },
        
        deleteitem:function(type,id){
           var ids,index; 
        ids=data.allItems[type].map(function(current){
              
                return current.id;
            });             //map genrates new array rather than foreach
            
          index = ids.indexOf(id);
            
            if (index !== -1){
                data.allItems[type].splice(index , 1); //splice is using to delete item in array
            }
        },
        
        
        
        
        
        
        
        calculateBudget:function(){
            
          // 1: calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            
        // 2: calculate the budget:income-expenses
            data.budget=data.totals.inc-data.totals.exp;
            
            
            
        //3: calculate the percentage of income that we spent
            if(data.totals.inc >0){
            
            data.percentage=Math.round((data.totals.exp /data.totals.inc)*100);
            }else{
                data.percentage=-1;
            }
            
        },
        
        calculatePercentage:function(){
            data.allItems.exp.forEach(function(cur){
               cur.calcpercentage(data.totals.inc);
                
            });
            
            
            
        },
        
        getPercentage:function(){
          
            var allperc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allperc;
        },
        
        getBudget:function(){
          
            return{
                budget:data.budget,
                totalINc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            };
            
        },
        
        
        
    };
    
    
    
    
    
    
})();







// UI controller
var UIcontroller = (function(){
    
    var DOMstrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetlabel:'.budget__value',
        incomelabel:'.budget__income--value',
        expenselabel:'.budget__expenses--value',
        percentagelabel:'.budget__expenses--percentage',
        container:'.container', //used for event delegation in order to delete the items
        expensesPerclabel:'.item__percentage',
        datelabel:'.budget__title--month'
    };
    
    
  var formatNumber = function(num,type){
          var numSplit,int,dec ; 
          // + or - before number
            
            
        // exactly 2 decimal pts
            
            
        // comma seprating thousands    
            
            num =Math.abs(num);
            num=num.toFixed(2);
            
            numSplit=num.split('.');
            
            int=numSplit[0];
            if (int.length>3){
                int=int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);
            }
            dec =numSplit[1];
            
            return (type === 'exp' ? '-' : '+')+' '+ int+'.'+dec;
            
  };
    
    
    
    
    return{
        getInput:function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,//will either be income or expenses
                description:document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
            
            
        },
        
        addListitem:function(obj,type){
            var Html,newHtml,element;
            // create html string with plceholder text
            
            if (type==='inc'){
                element=DOMstrings.incomeContainer;
                 Html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
                
            }else if(type==='exp'){
                element=DOMstrings.expenseContainer;
                 Html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
             
            //replace the placeholder text with actual data
            newHtml=Html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
            //insert the HTMl into the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
        deletelistItem:function(selectorID){
          var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        
        
        clearfeilds:function(){
            var feilds,feildarr;
          
            feilds=document.querySelectorAll(DOMstrings.inputDescription + ' ,' + DOMstrings.inputValue);
            
            feildarr=Array.prototype.slice.call(feilds);
            feildarr.forEach(function(current,index,array){
                current.value="";
            });
            feildarr[0].focus();
        },
        
        displayBudget: function(obj){
            var type;
            obj.budget>0? type='inc': type='exp';
            document.querySelector(DOMstrings.budgetlabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomelabel).textContent=formatNumber(obj.totalINc,'inc');
            document.querySelector(DOMstrings.expenselabel).textContent=formatNumber(obj.totalExp,'exp');
           
            if (obj.percentage>0){
                
                 document.querySelector(DOMstrings.percentagelabel).textContent=obj.percentage + '%';
                
            }else{
              document.querySelector(DOMstrings.percentagelabel).textContent='----';   
            } 
            
        },
        
        displaypercentage: function(percentages){
          var feilds = document.querySelectorAll(DOMstrings.expensesPerclabel);
            
            var nodeListForEach = function(list,callback){
              for (var i=0; i<list.length;i++){
                  callback(list[i],i);
                  
              }  
                
            };
            
            nodeListForEach(feilds,function(current,index){
               
                if (percentages[index]>0){
                current.textContent=percentages[index] + '%';
                }else{
                    current.textContent='---';
                }
            });
            
            
        
        
        
            
            
            
        },
        
        
        displayMonth:function(){
            var now,year,month,months;
            now=new Date();
            
            year=now.getFullYear();
            
            months=['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];
            month=now.getMonth();
            document.querySelector(DOMstrings.datelabel).textContent=months[month]+ '  '+ year;
            
            
        },
        
        
        
        getDOMstrings:function(){
            return DOMstrings;
        }
    };
    
    
    
})();












// global app controller

var controller =(function(budgetCtrl,UIctrl){
    
    
    var setupEventlistners = function(){
        
         var DOM = UIctrl.getDOMstrings();
        
         document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
         document.addEventListener('keypress', function(event){
        if (event.keyCode===13 || event.which===13){
            ctrlAddItem();
        }
    });
        
        
        document.querySelector(DOM.container).addEventListener('click', ctrldeleteItem);
        
        
        
    };
    
    
    
    var updatePercentages = function(){
        
        //1:calculate the percentage
      
        budgetCtrl.calculatePercentage();
        
        
        //2: read percentage from the budget controller
        var percentages = budgetCtrl.getPercentage();
        
        //3:update the UI with the new percentages
        UIctrl.displaypercentage(percentages);
        
        
    };
    
    
    
    
    
    var updateBudget= function(){
        
      //1: calculate the budget
        budgetCtrl.calculateBudget();
        
    //2: return the budget
        var budget = budgetCtrl.getBudget();
        

    //3: Display the budget on the UI    
        UIctrl.displayBudget(budget);
        
    };
    
    
    
    
    var ctrlAddItem = function(){
        var input,newItem;
        
        // 1. get the field input data
         input =UIctrl.getInput();
        
        if(input.description!=="" && !isNaN(input.value)&& input.value>0){
            
             // 2. add the item to the budget controller
        
        newItem=budgetCtrl.addItem(input.type,input.description,input.value);
        
        // 3. add the item to the UI
        
        UIctrl.addListitem(newItem,input.type)
        // 4. clear thhe feilds
        
        UIctrl.clearfeilds();
        
        // 4.calculate the budget
        
        
        
        // 5.calculate and update budget
        
        updateBudget();
        
        //6: calculate and update the percentages
            updatePercentages();
            
        }
        
       
        
        
    };
    
    var ctrldeleteItem=function(event){
     var itemid, splitId,type,ID;
        
        itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemid){
            
            splitId=itemid.split('-');
            type=splitId[0];
            ID=parseInt(splitId[1]); //parseint converts the string into nteger
            
            // 1. delete the item from data structure
            budgetCtrl.deleteitem(type,ID);
            
            // 2. delete the item fron ui
            
            UIctrl.deletelistItem(itemid);
            
            // 3.update n show the new budget
            
            updateBudget();
            
            //4:calc and update the percentage
            
            updatePercentages();
        }
        
        
    };
    
    
    
    return {
        init: function(){
            console.log('app has started');
            UIctrl.displayMonth();
              UIctrl.displayBudget({budget:0,
                totalINc:0,
                totalExp:0,
                percentage:-1});
                                   
            setupEventlistners();
        
        }
    };
    
   
    
    
    
})(budgetController,UIcontroller);
controller.init();