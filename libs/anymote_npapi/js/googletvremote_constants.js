/*
 * Copyright (C) 2012 Google Inc.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Defining namespace for plugin constants. */
googletvremote = {};


/** Defining namespace for Anymote session constants. */
googletvremote.pairing = {};


/** Defining namespace for Pairing session constants. */
googletvremote.anymote = {};


/**
 * Pairing events.  The pairing session's pair function has a callback.  The
 * event parameter passed into that callback will have a type that matches one
 * of these constants.
 */
googletvremote.pairing.EventType = {
  INVALID: 0,
  SESSION_CREATED: 1,
  SESSION_ENDED: 2,
  PERFORM_INPUT: 3,
  SUCCESS: 4,
  CANCELLED: 5,
  ERROR: 6
};


/** Strings used for debugging and logging. */
googletvremote.pairing.EventTypeStrings = ['INVALID', 'SESSION_CREATED',
    'SESSION_ENDED', 'PERFORM_INPUT', 'SUCCESS', 'CANCELLED', 'ERROR'];


/**
 * Pairing error codes.  If the event parameter is ERROR (see above) there will
 * also be an errorCode on the event that matches one of these constants.
 */
googletvremote.pairing.ErrorCode = {
  OK: 0,
  NETWORK_ERROR: 1,
  PROTOCOL_ERROR: 2,
  BAD_CONFIGURATION: 3,
  INVALID_CHALLENGE_RESPONSE: 4
};


/** Strings used for debugging and logging. */
googletvremote.pairing.ErrorCodeStrings = ['OK', 'NETWORK_ERROR',
    'PROTOCOL_ERROR', 'BAD_CONFIGURATION', 'INVALID_CHALLENGE_RESPONSE'];


/**
 * Anymote Key codes.  List of values for Google TV keys. Matches proto found at
 * http://code.google.com/p/anymote-protocol/source/browse/proto/keycodes.proto
 */
googletvremote.anymote.KeyCode = {
  UNKNOWN: 0,
  SOFT_LEFT: 1,
  SOFT_RIGHT: 2,
  HOME: 3,//
  BACK: 4,//
  CALL: 5,
  NUM0: 7,//
  NUM1: 8,//
  NUM2: 9,//
  NUM3: 10,//
  NUM4: 11,//
  NUM5: 12,//
  NUM6: 13,//
  NUM7: 14,//
  NUM8: 15,//
  NUM9: 16,//
  STAR: 17,
  POUND: 18,
  DPAD_UP: 19,//
  DPAD_DOWN: 20,//
  DPAD_LEFT: 21,//
  DPAD_RIGHT: 22,//
  DPAD_CENTER: 23,//
  VOLUME_UP: 24,//
  VOLUME_DOWN: 25,//
  POWER: 26,
  CAMERA: 27,
  A: 29,
  B: 30,
  C: 31,
  D: 32,
  E: 33,
  F: 34,
  G: 35,
  H: 36,
  I: 37,
  J: 38,
  K: 39,
  L: 40,
  M: 41,
  N: 42,
  O: 43,
  P: 44,
  Q: 45,
  R: 46,
  S: 47,
  T: 48,
  U: 49,
  V: 50,
  W: 51,
  X: 52,
  Y: 53,
  Z: 54,
  COMMA: 55,
  PERIOD: 56,
  ALT_LEFT: 57,
  ALT_RIGHT: 58,
  SHIFT_LEFT: 59,
  SHIFT_RIGHT: 60,
  TAB: 61,
  SPACE: 62,	
  EXPLORER: 64,
  ENTER: 66,
  DEL: 67,
  GRAVE: 68,
  MINUS: 69,
  EQUALS: 70,
  LEFT_BRACKET: 71,
  RIGHT_BRACKET: 72,
  BACKSLASH: 73,
  SEMICOLON: 74,
  APOSTROPHE: 75,
  SLASH: 76,
  AT: 77,
  FOCUS: 80,
  PLUS: 81,
  MENU: 82,//
  SEARCH: 84,//
  MEDIA_PLAY_PAUSE: 85,  //---
  MEDIA_STOP: 86,//
  MEDIA_NEXT: 87,//
  MEDIA_PREVIOUS: 88,//
  MEDIA_REWIND: 89,//
  MEDIA_FAST_FORWARD: 90,//
  MUTE: 91,//
  CTRL_LEFT: 92,
  CTRL_RIGHT: 93,
  INSERT: 94,
  PAUSE: 95,//
  PAGE_UP: 96,//
  PAGE_DOWN: 97,//
  PRINT_SCREEN: 98,

  INFO: 103,//
  WINDOW: 104,//

  BOOKMARK: 110,//
  CAPS_LOCK: 111,
  ESCAPE: 112,//
  META_LEFT: 113,
  META_RIGHT: 114,
  ZOOM_IN: 115,   //
  ZOOM_OUT: 116,   //
  CHANNEL_UP: 117, //
  CHANNEL_DOWN: 118, //

  LIVE: 120,//
  DVR: 121,//
  GUIDE: 122,//
  MEDIA_SKIP_BACK: 123,
  MEDIA_SKIP_FORWARD: 124,
  MEDIA_RECORD: 125,//
  MEDIA_PLAY: 126,//

  PROG_RED: 128,  //
  PROG_GREEN: 129,  //
  PROG_YELLOW: 130,  //
  PROG_BLUE: 131,  //
  BD_POWER: 132,
  BD_INPUT: 133,
  STB_POWER: 134,//
  STB_INPUT: 135,//
  STB_MENU: 136,//
  TV_POWER: 137,//
  TV_INPUT: 138,//
  AVR_POWER: 139,//
  AVR_INPUT: 140,//
  AUDIO: 141,  //
  EJECT: 142,//
  BD_POPUP_MENU: 143,
  BD_TOP_MENU: 144,
  SETTINGS: 145,//
  SETUP: 146,

  //New set
  PICTSYMBOLS: 148,
  SWITCH_CHARSET: 149,
  FORWARD_DEL: 150,
  SCROLL_LOCK: 151,
  FUNCTION: 152,
  SYSRQ: 153,
  BREAK: 154,
  MOVE_HOME: 155,
  MOVE_END: 156,
  FORWARD: 157,
  MEDIA_CLOSE: 158,
  F1: 159,
  F2: 160,
  F3: 161,
  F4: 162,
  F5: 163,
  F6: 164,
  F7: 165,
  F8: 166,
  F9: 167,
  F10: 168,
  F11: 169,
  F12: 170,
  NUM_LOCK: 171,
  NUMPAD_0: 172,
  NUMPAD_1: 173,
  NUMPAD_2: 174,
  NUMPAD_3: 175,
  NUMPAD_4: 176,
  NUMPAD_5: 177,
  NUMPAD_6: 178,
  NUMPAD_7: 179,
  NUMPAD_8: 180,
  NUMPAD_9: 181,
  NUMPAD_DIVIDE: 182,
  NUMPAD_MULTIPLY: 183,
  NUMPAD_SUBTRACT: 184,
  NUMPAD_ADD: 185,
  NUMPAD_DOT: 186,
  NUMPAD_COMMA: 187,
  NUMPAD_ENTER: 188,
  NUMPAD_EQUALS: 189,
  NUMPAD_LEFT_PAREN: 190,
  NUMPAD_RIGHT_PAREN: 191,
  APP_SWITCH: 192,



  // Pointer buttons
  BTN_FIRST: 256,
  BTN_MISC: 256,
  BTN_0: 256,
  BTN_1: 257,
  BTN_2: 258,
  BTN_3: 259,
  BTN_4: 260,
  BTN_5: 261,
  BTN_6: 262,
  BTN_7: 263,
  BTN_8: 264,
  BTN_9: 265,

  BTN_LEFT: 272,
  BTN_RIGHT: 273,
  BTN_MIDDLE: 274,
  BTN_SIDE: 275,
  BTN_EXTRA: 276,
  BTN_FORWARD: 277,
  BTN_BACK: 278,
  BTN_TASK: 279
};


/**
 * Key action sent along with a key code value.
 */
googletvremote.anymote.Action = {
  UP: 0, // Key released
  DOWN: 1 // Key pressed
};


/**
 * Anymote event types.  The Anymote start session function has a callback.  The
 * event parameter passed into that callback will have a type that matches one
 * of these constants.
 */
googletvremote.anymote.EventType = {
  INVALID: 0,
  CONNECTED: 1,
  ACK: 2,
  DATA: 3,
  DATALIST: 4,
  FLINGRESULT: 5,
  ERROR: 6
};


/** Strings used for debugging and logging. */
googletvremote.anymote.EventTypeStrings = ['INVALID', 'CONNECTED', 'ACK',
    'DATA', 'DATALIST', 'FLINGRESULT', 'ERROR'];


/**
 * Anymote error codes.  If the event parameter is ERROR (see above) there will
 * also be an errorCode on the event that matches one of these constants.
 */
googletvremote.anymote.ErrorCode = {
  NONE: 0,
  UNKNOWN: 1,
  NOTPAIRED: 2,
  PROTOCOL: 3,
  INVALID_KEYCODE: 4,
  INVALID_ACTION: 5,
  INVALID_SEQUENCE: 6
};


/** Strings used for debugging and logging. */
googletvremote.anymote.ErrorCodeStrings = ['NONE', 'UNKNOWN', 'NOTPAIRED',
    'PROTOCOL', 'INVALID_KEYCODE', 'INVALID_ACTION', 'INVALID_SEQUENCE'];


/**
 * Anymote sendData data types.
 */
googletvremote.anymote.DataType = {
  STRING: 'com.google.tv.string'
};
