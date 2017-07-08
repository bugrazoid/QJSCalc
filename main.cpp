#include <QApplication>
#include <QWidget>
#include <QtScript>
#include <QMainWindow>
#include <QAction>
#include <QDebug>
#include <QtScriptTools/QScriptEngineDebugger>
#include <QtUiTools/QUiLoader>

//#define SCRIPT_DEBUGGER

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    
    QWidget* ui;
    {
        QUiLoader* uiLoader = new QUiLoader;
        QFile* uiFile = new QFile(":/calc.ui");
        uiFile->open(QIODevice::ReadOnly);
        ui = uiLoader->load(uiFile);
        uiFile->close();
        delete uiLoader;
        delete uiFile;
    }

    QScriptEngine* engine = new QScriptEngine;
#ifdef SCRIPT_DEBUGGER
    QScriptEngineDebugger debugger;
    debugger.attachTo(engine);
    debugger.action(QScriptEngineDebugger::InterruptAction)->trigger();
    QMainWindow *debugWindow = debugger.standardWindow();
    debugWindow->resize(1024, 640);
    debugWindow->show();
#endif
    {
        QFile* jsFile = new QFile(":/calcCore.js");
        jsFile->open(QIODevice::ReadOnly);
        engine->evaluate(jsFile->readAll());
        jsFile->close();
        delete jsFile;
    }

    QScriptValue calcCore = engine->evaluate("CalcCore");
    QScriptValue scriptUi = engine->newQObject(ui, QScriptEngine::ScriptOwnership);
    //                         Теперь вот этим ^^ владеет движок JS.
    QScriptValue calc = calcCore.construct(QScriptValueList() << scriptUi);

    ui->show();

    int r = a.exec();
    delete engine;
//    delete ui; // не удаляем, т.к. передали владение в скриптовый движок.
    return r;
}
