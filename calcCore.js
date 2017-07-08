Function.prototype.bind = function()
{
    // Установим ссылку на вызванную функцию.
    var func = this;
    // Утановим ссылку на объект владеющий функцией обработчиком.
    var thisObject = arguments[0];
    // Сделаем срез аргументов для передачи в функцию обработчик.
    var args = Array.prototype.slice.call(arguments, 1);
    return function()
    {
        // Вернем функцию обработчик с заданными аргументами.
        return func.apply(thisObject, args);
    }
}



function CalcCore(ui)
{
    this.ui = ui;
    this.a  = undefined;
    this.b  = undefined;
    this.op = undefined;
    this.buff = "";

    ui.pbNum_0.clicked.connect(this.pressDigit.bind(this, 0));
    ui.pbNum_1.clicked.connect(this.pressDigit.bind(this, 1));
    ui.pbNum_2.clicked.connect(this.pressDigit.bind(this, 2));
    ui.pbNum_3.clicked.connect(this.pressDigit.bind(this, 3));
    ui.pbNum_4.clicked.connect(this.pressDigit.bind(this, 4));
    ui.pbNum_5.clicked.connect(this.pressDigit.bind(this, 5));
    ui.pbNum_6.clicked.connect(this.pressDigit.bind(this, 6));
    ui.pbNum_7.clicked.connect(this.pressDigit.bind(this, 7));
    ui.pbNum_8.clicked.connect(this.pressDigit.bind(this, 8));
    ui.pbNum_9.clicked.connect(this.pressDigit.bind(this, 9));

    ui.pbDot.clicked.connect(this.pressDigit.bind(this, "."));

    ui.pbPlus   .clicked.connect(this.pressOperator.bind(this, "+"));
    ui.pbMinus  .clicked.connect(this.pressOperator.bind(this, "-"));
    ui.pbMult   .clicked.connect(this.pressOperator.bind(this, "*"));
    ui.pbDivide .clicked.connect(this.pressOperator.bind(this, "/"));
    ui.pbEval   .clicked.connect(this.pressOperator.bind(this, "="));

    ui.pbClear  .clicked.connect(this, "clear");
    ui.pbNegate .clicked.connect(this, "negate");
    ui.pbBsp    .clicked.connect(this, "backspace");

    this.ui.windowTitle = "JSCalc";
}



CalcCore.prototype.pressDigit = function(digit)
{
    this.buff += digit;
    this.ui.leView.text = this.buff;
}



CalcCore.prototype.pressOperator = function(op)
{
    var doCalc = function()
    {
        var hist = this.a+this.op+this.b;
        switch (this.op)
        {
        case "+" :
            this.a += this.b;
            break;
        case "-" :
            this.a -= this.b;
            break;
        case "*" :
            this.a *= this.b;
            break;
        case "/" :
            this.a /= this.b;
            break;
        case "=" :
            return false;
        }
        hist += "=" + this.a;
        print(hist);
        //        this.ui.lwHist.isertItem(0,String(hist));
        return true;
    }

    if (this.a === undefined)
    {
        this.a = Number(this.buff);
        this.op = op;
    }
    else if (this.b === undefined)
    {
        this.b = Number(this.buff);

        doCalc.call(this);
        this.ui.leView.text = this.a;
        this.buff = this.a+"";
        if (op === "=")
            return;

        this.b = undefined;
        this.op = op;
        return;
    }
    else if (op === "=")
    {
        this.a = Number(this.buff);
        doCalc.call(this);
        this.ui.leView.text = this.a;
        this.buff = this.a+"";
        return;
    }
    else
    {
        this.b = undefined;
        this.op = op;
    }

    this.buff = "";
}



CalcCore.prototype.clear = function()
{
    this.a    = undefined;
    this.b    = undefined;
    this.op   = undefined;
    this.buff = "";
    this.ui.leView.clear();
}



CalcCore.prototype.negate = function()
{
    var sign = this.buff.slice(0,1);
    if (this.buff === "")
        this.buff = "-"
    else if (sign === "-")
        this.buff = this.buff.slice(1);
    else
        this.buff = "-"+this.buff;
    this.ui.leView.text = this.buff;
}



CalcCore.prototype.backspace = function()
{
    if (this.buff.length > 0)
    {
        this.buff = this.buff.slice(0,-1);
        this.ui.leView.text = this.buff;
    }
}
