/*:
 * @plugindesc Include message from external file.
 * @author Baizan(twitter:into_vision)
 * @version 1.2.0
 * 
 * @param Line Max
 * @desc
 * @default 4
 * @type number
 * 
 * @param Csv File Path
 * @desc
 * @default ExternMessage.csv
 * @type string
 * 
 * @param Use Name Tag
 * @desc
 * @default true
 * @type boolean
 */

/*:ja
 * @plugindesc 外部ファイルから文章を読み取ります。
 * @author バイザン(twitter:into_vision)
 * @version 1.2.0
 * 		1.2.0 2021/03/06	ツクール変数を添字に指定できるように
 * 							ツクール変数の添字にもメッセージIDを指定できるように
 * 		1.1.0 2020/09/23	Window関連のコマンド追加。再起コマンド実行可能なテキスト置き換え機能実装
 * 		1.0.7 2020/09/22	MZではさらにsetupNewGameが細分化されていたので共通して呼び出される場所で初期化するように
 * 		1.0.6 2020/09/22	イベントテスト/戦闘テスト実行時に'TEST_'の接頭語をつけて読み込まれる仕様を回避するように
 * 		1.0.5 2020/09/12	イベントコマンド実行後のメッセージが表示されない問題の修正
 * 		1.0.4 2020/08/22	ツクールMZに対応。具体的には名前ウィンドウ対応
 * 		1.0.3 2020/07/17	最終行の読み取りエラーに対応
 * 		1.0.2 2020/07/16	パラメーターにセフティー処理追加
 * 							CRLF(\r\n)改行だとうまく動かない問題に対応
 * 		1.0.1 2020/04/25	CSV1行目をヘッダー扱いにしてた仕様を削除
 * 		1.0.0 2020/04/25	初版公開
 * 
 * @param Line Max
 * @desc メッセージが指定した行数超えたらページ送りします
 * @default 4
 * @type number
 * 
 * @param Csv File Path
 * @desc メッセージが記述されてるcsvファイルパス。ルートパスはdataフォルダになっています。
 * @default ExternMessage.csv
 * @type string
 * 
 * @param Use Name Tag
 * @desc :nameコマンドを使用した際に名前タグを挿入します。
 * @default true
 * @type boolean
 * 
 * @help
 * 【セットアップ方法】
 *   ・「ExternMessage.js」を ./js/pluguins/ フォルダに入れる
 *   ・「ExternMessage.csv」を ./data/ フォルダに 「新規作成」する。
 *   	読み込みたいcsvファイルの名前は設定で変更可能です。
 *   	そもそもcsvファイルって何？って方は検索していただけると嬉しいです...
 *   	CSVファイルは以下のようなフォーマットにしてください。
 *   		メッセージID, メッセージ
 *   		メッセージID, メッセージ
 *   		メッセージID, メッセージ
 *   	
 *   	エクセルの表示的には1列目にメッセージID、2列目にメッセージとなります。
 *
 *
 * 【イベントエディター中の「文章」に追加される制御文字】
 *   \M[メッセージID]
 *  	CSVファイル内に記述されている一致する「メッセージID」に対応する「メッセージ」へ置き換えます。
 *  	「メッセージID」は「\V[1]」のようなツクール変数を指定することも可能です。
 *  	また「TEST_\V[1]」のように連結させて別のメッセージIDを作ることも可能です。
 *  	さらに「TEST_\V[SELECT_VALUE]」のようにして「メッセージID」をツクール変数の添字に出来ます。
 * 
 *   ツクール変数制御文字 \V[n], \C[n] の添字nにも「メッセージID」を指定できるようにしました(ver.1.2.0)
 *
 *
 * 【CSVファイル側で有効なコマンド】
 *   :name[名前, 顔グラのセット名]
 *   	別ウィンドウの名前表示欄に設定する名前と使用する「顔グラのセット」名を指定します。
 *   	「顔グラのセット」名は顔グラを使用しない場合は省略できます。
 *   	また「名前」に「\N[1]」のようなRPGツクールの制御文字を記述することもできます。
 *   
 *   	推奨する使い方として「名前, 顔グラのセット名」をまとめたメッセージIDを定義し、名前と顔グラがずれることを防止します。
 *   
 *   :face[顔グラの番号]
 *   	現在セットされてる「顔グラのセット」内の指定した番号の顔グラに変更します。
 *   	推奨する使い方としてすべての顔グラの表情の番号を統一し、
 *   	「メッセージID」で管理することで文章中でも表情が視認しやすくなります。
 *   
 *   :word[メッセージID]
 *   	指定したメッセージIDに対応する単語に置き換えます。
 *   	置き換え後のメッセージは再度検証されないので改行やコマンドを使用しないでください。
 *   
 *   :page
 *   	次の行を次のページに送ります。
 *   
 *   :event[イベント番号]
 *   	指定した番号のコモンイベントを呼び出します。
 *   	推奨する使い方として直接数値を打ち込まずに「メッセージID」で置き換えることで視認性を上げます。
 *   
 *   :fadeout
 *   	画面を黒暗転させます。
 *   
 *   :fadein
 *   	黒暗転状態から画面を表示させます。
 */

//---------------------------------------------------------------------------------------------
// ExternMessage データーベース
//---------------------------------------------------------------------------------------------
var $externMessage =
{
	setup: function() {
		// setupはゲーム起動時の他ロード時でも呼ばれる。
		// しかし内部データは書き換えることは(少なくともこのプラグインでは)無いのでスキップする。
		if (this.map) {
			return;
		}

		// 改行コードを置き換え
		$externMessageCSV = $externMessageCSV.replace("\r\n", "\n");

		// 2次元配列に変換
		var result = CsvImportor.parseFromCSV($externMessageCSV);

		this.map = new Array();
		for(var i = 0; i < result.length; i++)
		{
			var currentLine = result[i];
			var guid = currentLine[0];
			this.map[guid] = this.convertToMessage(currentLine);
		}
	}, 

	convertToMessage: function(currentLine) {
		return currentLine[1];
	}
};

// CSVファイルのグローバルアクセス
var $externMessageCSV = null;

(function() {
	var parameters = PluginManager.parameters('ExternMessage');
	let safety = (name, def_value) => {
		let value = parameters[name];
		return (value === undefined) ? def_value : value;
	};
	$externMessage.LineMax = Number(safety('Line Max', '4'));
	$externMessage.CsvFilePath = String(safety('Csv File Path', 'ExternMessage.csv'));
	$externMessage.UseNameTag = safety('Use Name Tag', 'true') === 'true';

	// DataManagerへ読み込みの予約とセットアップの予約
	DataManager._databaseFiles.push({ name:'$externMessageCSV',	src:$externMessage.CsvFilePath	});

	// もともとsetupNewGame時に呼ぶようにしていたが、MZではsetupNewGame/setupBattleTest/setupEventTestで細分化された。
	// そのため各setupで共通して呼び出されているcreateGameObjectsで初回のみセットアップするように変更
	var _DataManager_createGameObjects = DataManager.createGameObjects;
	DataManager.createGameObjects = function() {
		_DataManager_createGameObjects.apply(this, arguments);
		$externMessage.setup();
	};
})();

//---------------------------------------------------------------------------------------------
// CSV Helper
//---------------------------------------------------------------------------------------------
// CSVファイルから2次元配列にパースする
var CsvImportor = 
{
	parseFromCSV: function(text)
	{
		text = text.replace(/\r\n/g,"\n");
		var result = new Array();
		var currentLine = new Array();
		var begin = 0;
		let pushToken = (index) => {
			let token = this.getToken(text, begin, index - begin);
			currentLine.push(token);
			begin = index + 1;
		};
		for(var index = 0; index < text.length; ++index)
		{
			var c = text[index];
			switch(c)
			{
				case ',':
					pushToken(index);
					break;
				case '"':
					index = this.nextDoubleQuat(text, index + 1);
					break;
				case '\n':
					pushToken(index);
					result.push(currentLine);
					currentLine = new Array();
					break;
			}
		}
		if (index !== begin || currentLine.length > 0) {
			pushToken(text.length);
			result.push(currentLine);
			currentLine = null;
		}
		return result;
	},

	// 文字トークンを抜き出す
	getToken: function(text, begin, count) {
		if(text[begin] == '"') {
			return text.substr(begin + 1, count - 2);
		} else {
			return text.substr(begin, count);
		}
	},

	// 次のダブルクォーテーションのインデックスを取得する
	nextDoubleQuat: function(text, index)
	{
		do {
			index = text.indexOf('"', index);
		} while(text[index - 1] == '\\');
		return index;
	},
};


//---------------------------------------------------------------------------------------------
// DataManager拡張
//---------------------------------------------------------------------------------------------
(function() {
	// 拡張子によって読み込むファイルを変更する
	const _DataManager_loadDataFile = DataManager.loadDataFile;
	DataManager.loadDataFile = function(name , src) {
		var extensionBegin = src.lastIndexOf('.');
		var extension = src.substr(extensionBegin, src.length - extensionBegin);
		if (extension == ".json") {
			_DataManager_loadDataFile.apply(this, arguments);
		} else {
			DataManager.loadCSVFile(name, src);
		}
	}

	// csv読み込み用拡張
	DataManager.loadCSVFile = function(name, src) {
		var xhr = new XMLHttpRequest();
		var url = 'data/' + src;
		xhr.open('GET', url);
		xhr.overrideMimeType('text/plain; charset=shift_jis');
		xhr.onload = function() {
			if (xhr.status < 400) {
				window[name] = xhr.responseText;
			}
		};
		xhr.onerror = this._mapLoader || function() {
			// 戦闘テストまたはイベントテスト実行時に'Test_'を接頭語にしたファイルが生成されそれが読み込まれる。
			// しかし外部ファイルはツクールエディタの管理外なので複製されない。それの対処として接頭語が付いてたら読み直す。
			// 参照：rpg_manager/DataManager.loadDatabase
			var prefix = 'Test_';
			if(src.indexOf(prefix) === 0) {
				DataManager.loadDataFile(name, src.substr(prefix.length));
			} else {
				DataManager._errorUrl = DataManager._errorUrl || url;
			}
		};
		window[name] = null;
		xhr.send();
	};
})();

//---------------------------------------------------------------------------------------------
// Game_Interpreter拡張
//---------------------------------------------------------------------------------------------
(function() {
	// 制御文字置換メソッド
	// 制御文字を変更する場合はこれをoverrideする
	Game_Interpreter.replaceCtrlText = function(text) {
		return text.replace(/\\M\[(\S+)\]/gi, function() {
			var key = arguments[1];
			var value = $externMessage.map[key];
			if (value === undefined) {
				alert("不正なメッセージIDが検出されました:" + key);
			}
			return value;
		});
	};

	// commandListが渡されるので横取りして変換する
	const _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
	Game_Interpreter.prototype.setup = function(list, eventId) {
		var replaced = new Array();
		for (const item of list) {
			if (item.code == 401) { // message
				Game_Interpreter.convertMessageCommand(replaced, item);
			} else {
				replaced.push(item);
			}
		}
		_Game_Interpreter_setup.apply(this, [replaced, eventId]);
	};

	// メッセージコマンドを変換する
	Game_Interpreter.convertMessageCommand = function(dest, item)
	{
		var context = {
			lastName: "",
			lastFace: "",
			lastFaceID: 0,
			lineCount: getCurrentLine(dest),
			windowMode: 0, // 0:通常, 1:暗く, 2:透明
			layoutMode: 2, // 0:上, 1中, 2下
			indent: item.indent,
		};

		// 文章の場合は必ず1行
		// 参照:Game_Interpreter.prototype.command101
		this.convertMessageCommandCore(dest, item.parameters[0], context);
	}

	Game_Interpreter.convertMessageCommandCore = function(dest, text, context)
	{
		// メッセージ用制御文字を置換
		text = Game_Interpreter.replaceCtrlText(text);

		// 改行ごとに別メッセージとして処理
		var messages = text.replace("\r\n", "\n").split("\n");

		for (var message of messages)
		{
			// ツクール変数の添え字もメッセージIDに対応
			// \P[n], \N[n]もあるが対応する必要性が余り感じられないので様子見
			message = parseCmd(message, "\\V", args => {
				return tryReplace(args)[0];
			});
			message = parseCmd(message, "\\C", args => {
				return tryReplace(args)[0];
			});

			// 単語を置き換える。再起コマンド実行可能。
			var textFound = false;
			message = parseCmd(message, "\\M", args => {
				var result = tryReplace(args);
				if (result.length > 0) {
					textFound = true;
					// 文章の間で見つかった場合は一旦結合させてそれを後段ですべて丸投げする。
					return result[0];
				} else {
					return null;
				}
			});
			if (textFound) {
				// text置き換え及び前後の文字がすべて結合した状態になっている
				// 文章開始:text[TEST]文章終了→文章開始 置き換え文章 文章終了
				this.convertMessageCommandCore(dest, message, context);

				// 既に処理済みなのでこの行に関しては後続の処理はスキップして良い
				continue;
			}

			// 名前の取り出し
			message = parseCmd(message, ":name", args => {
				args = tryReplace(args);
				context.lastName = args[0];
				// メモ:Faceが変更される場合にウィンドウが一度閉じるアニメーションが挟まります。
				context.lastFace = args[1] || "";
				// 顔の番号は初期化する
				context.lastFaceID = 0;
				// 名前は変更時は常にページを切り変える
				context.lineCount = $externMessage.LineMax;
			});
			// 表情の種類を選択します
			message = parseCmd(message, ":face", args => {
				context.lastFaceID = tryReplace(args)[0];
				context.lineCount = $externMessage.LineMax;
			});
			// :pageが含まれていたら次の行でページ送りさせる。
			message = parseCmd(message, ":page", args => {
				context.lineCount = $externMessage.LineMax;
			});
			// コモンイベントの呼び出し
			message = parseCmd(message, ":event", args => {
				var id = tryReplace(args)[0];
				dest.push({ code: 117, indent: context.indent, parameters: [ parseInt(id) ] });
				context.lineCount = $externMessage.LineMax; // 特殊なcodeの実行後は必ず改ページする必要がある
			});
			// フェードアウト
			message = parseCmd(message, ":fadeout", args => {
				dest.push({ code: 221, indent: context.indent, parameters: [ ] });
				context.lineCount = $externMessage.LineMax;
			});
			// フェードイン
			message = parseCmd(message, ":fadein", args => {
				dest.push({ code: 222, indent: context.indent, parameters: [ ] });
				context.lineCount = $externMessage.LineMax;
			});
			// ウィンドウの種類
			message = parseCmd(message, ":bg", args => {
				if (args === "dim") {
					context.windowMode = 1;
				} else if (args === "transparent") {
					context.windowMode = 2;
				} else { // args == window
					context.windowMode = 0;
				}
				context.lineCount = $externMessage.LineMax;
			});
			// ウィンドウのレイアウト位置
			message = parseCmd(message, ":layout", args => {
				if (args === "top") {
					context.layoutMode = 0;
				} else if (args === "center") {
					context.layoutMode = 1;
				} else {
					context.layoutMode = 2;
				}
				context.lineCount = $externMessage.LineMax;
			});

			// 3列ごとにページウェイトを挟む
			// command101は正確には新規文章ウィンドウ表示コマンドです。
			// Game_Interpreter["command" + code] の関数が呼ばれる。
			// 101のparametersは[FaceName, FaceId, Background, PositionType]
			// 参照:Game_Interpreter.prototype.executeCommand
			if (context.lineCount >= $externMessage.LineMax) {
				// もし直前に同じ101コマンドがあれば書き換える
				if (dest.length > 0 && dest[dest.length - 1].code == 101) {
					dest.length--;
				}
				dest.push({ code: 101, indent: context.indent, parameters: createParam101(context.lastFace, context.lastFaceID, context.lastName, context.windowMode, context.layoutMode) });
				context.lineCount = 0;
			}

			// ページごとに名前タグの効果が切れるので挿入し直す
			var name_tag_only = false;
			if (isGameMakerMV()) {
				if (context.lineCount == 0 && context.lastName.length > 0) {
					if ($externMessage.UseNameTag) {
						name_tag_only = message.length == 0;
						message = "\\n<" + context.lastName + ">" + message;
					}
				}
			}

			// 文章を1行追加
			if (message.length > 0 && !name_tag_only) {
				dest.push({ code: 401, indent: context.indent, parameters: [ message ] });
				context.lineCount++;
			}
		}
	}

	// 101コマンド用の引数を構築します。
	createParam101 = function(faceName, faceID, speakName, windowMode, layoutMode) {
		if(isGameMakerMV() || !$externMessage.UseNameTag) {
			if (faceID < 0 || faceName == "") {
				return ["", 0, windowMode, layoutMode];
			} else {
				return [faceName, faceID, windowMode, layoutMode];
			}
		} else {
			// MZでは4要素目に名前を追加することで名前ウィンドウが表示されるようになった
			if (faceID < 0 || faceName == "") {
				return ["", 0, windowMode, layoutMode, speakName];
			} else {
				return [faceName, faceID, windowMode, layoutMode, speakName];
			}
		}
	};
	
	// 値がマップされている場合に置き換える
	tryReplace = function(value, list) {
		value = value.trim();
		if (list === undefined) {
			list = new Array();
		}
		if (value.includes(',')) {
			for (const v of value.split(',')) {
				tryReplace(v, list);
			}
		} else {
			// ツクールの変数が添字に使用されてる場合はパースする
			// ここで TEST_\V[0] のように組み合わせられてる可能性も考慮すること
			value = parseCmd(value, "\\V", args => {
				args = tryReplace(args)[0]; // Vの添字の再帰チェック。いらないかもしれない。
				return $gameVariables.value(parseInt(args)).toString();
			});

			var result = $externMessage.map[value];
			if (result === undefined) {
				list.push(value);
			} else {
				tryReplace(result, list);
			}
		}
		return list;
	};
	
	// keyに一致するコマンドがあった場合にメソッドを呼び出します。
	// 続けて[]が付与されていたら引数として解釈します。
	parseCmd = function(text, key, call) {
		var result = "";
		var headIdx = 0;
		for(var idx = text.indexOf(key, headIdx); idx != -1; idx = text.indexOf(key, headIdx))
		{
			result += text.substring(headIdx, idx);
			headIdx = idx + key.length;
			var arg = parseArg(text, headIdx);
			if (arg != null)
			{
				headIdx += arg.length + 2; // 2 is '[]'
			}

			// 返却値に文字列が含まれてたらコマンドと置き換える形で追加する
			var str = call(arg);
			if (str)
			{
				result += str;
			}
		}
		if (headIdx > 0) {
			return result + text.substr(headIdx);
		} else {
			return text;
		}
	};

	// []の中の引数を入れ子になった[]を無視して一つの引数として取り出します。
	parseArg = function(text, idx)
	{
		var head = idx;
		for (var depth = 0; idx < text.length; idx++)
		{
			switch(text[idx])
			{
				case '[':
					depth++;
					break;
				case ']':
					depth--;
					break;
			}

			if (depth <= 0) {
				break;
			}
		}

		return (head < idx) ? text.substring(head + 1, idx) : null;
	};

	// 現在直前の切り替えから何列目の文字列か調べる
	getCurrentLine = function(dest) {
		var lineCount = 0;
		for (var d of dest) {
			switch(d)
			{
				case 401:
					lineCount++;
					break;
				case 101:
					lineCount = 0;
					break;
			}
		}
		return lineCount;
	};

	isGameMakerMV = function() {
		return Utils.RPGMAKER_NAME === "MV";
	}
})();
