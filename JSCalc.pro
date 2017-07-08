#-------------------------------------------------
#
# Project created by QtCreator 2017-01-16T23:17:57
#
#-------------------------------------------------

QT       += core gui script scripttools

TARGET = JSCalc
CONFIG += uitools
CONFIG   -= app_bundle

TEMPLATE = app


SOURCES += main.cpp

FORMS += \
    calc.ui

RESOURCES += \
    JSCalc.qrc

OTHER_FILES += \
    calcCore.js

QMAKE_CXXFLAGS += -std=c++11
