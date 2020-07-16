/*:
 * @plugindesc Include message from external file.
 * @author Baizan(twitter:into_vision)
 * @version 1.0.2
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
 * @version 1.0.2
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

	// ロードが完了したら呼ばれるように
	var _DataManager_setupNewGame = DataManager.setupNewGame;
	DataManager.setupNewGame = function() {
		_DataManager_setupNewGame.apply(this, arguments);
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
		for(var index = 0; index < text.length; ++index)
		{
			var c = text[index];
			switch(c)
			{
				case ',':
					token = this.getToken(text, begin, index - begin);
					currentLine.push(token);
					begin = index + 1;
					break;
				case '"':
					index = this.nextDoubleQuat(text, index + 1);
					break;
				case '\n':
					token = this.getToken(text, begin, index - begin);
					currentLine.push(token);
					begin = index + 1;

					result.push(currentLine);
					currentLine = new Array();
					break;
			}
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
			DataManager._errorUrl = DataManager._errorUrl || url;
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
		// 文章の場合は必ず1行
		// 参照:Game_Interpreter.prototype.command101
		var text = item.parameters[0];

		// メッセージ用制御文字を置換
		text = Game_Interpreter.replaceCtrlText(text);

		// 改行ごとに別メッセージとして処理
		var messages = text.replace("\r\n", "\n").split("\n");

		var lastName = "";
		var lastFace = "";
		var lastFaceID = 0;
		var prevFace = "";
		var lineCount = getCurrentLine(dest);
		for (var message of messages)
		{
			// 名前の取り出し
			message = parseCmd(message, ":name", args => {
				args = tryReplace(args);
				lastName = args[0];
				// メモ:Faceが変更される場合にウィンドウが一度閉じるアニメーションが挟まります。
				lastFace = args[1] || "";
				// 顔の番号は初期化する
				lastFaceID = 0;
				// ページの最初以外で検出したらページを切り変える
				if (lineCount != 0) {
					lineCount = $externMessage.LineMax;
				}
			});

			// 表情の種類を選択します
			message = parseCmd(message, ":face", args => {
				lastFaceID = tryReplace(args)[0];
			});

			// 3列ごとにページウェイトを挟む
			// command101は正確には新規文章ウィンドウ表示コマンドです。
			// Game_Interpreter["command" + code] の関数が呼ばれる。
			// 101のparametersは[FaceName, FaceId, Background, PositionType]
			// 参照:Game_Interpreter.prototype.executeCommand
			if (lineCount >= $externMessage.LineMax) {
				dest.push({ code: 101, indent: item.indent, parameters: createParam101(lastFace, lastFaceID) });
				lineCount = 0;
			}

			// ページごとに名前タグの効果が切れるので挿入し直す
			var name_tag_only = false;
			if (lineCount == 0 && lastName.length > 0) {
				if ($externMessage.UseNameTag) {
					name_tag_only = message.length == 0;
					message = "\\n<" + lastName + ">" + message;
				}
			}

			// 単語を置き換える
			// 複数行や再起コマンド実行などは対応していない
			message = parseCmd(message, ":word", args => {
				return tryReplace(args);
			});
			// :pageが含まれていたら次の行でページ送りさせる。
			message = parseCmd(message, ":page", args => {
				lineCount = $externMessage.LineMax;
			});
			// コモンイベントの呼び出し
			message = parseCmd(message, ":event", args => {
				var id = tryReplace(args)[0];
				dest.push({ code: 117, indent: item.indent, parameters: [ parseInt(id) ] });
			});
			// フェードアウト
			message = parseCmd(message, ":fadeout", args => {
				dest.push({ code: 221, indent: item.indent, parameters: [ ] });
				dest.push({ code: 101, indent: item.indent, parameters: createParam101(lastFace, lastFaceID) });
			});
			// フェードイン
			message = parseCmd(message, ":fadein", args => {
				dest.push({ code: 222, indent: item.indent, parameters: [ ] });
				dest.push({ code: 101, indent: item.indent, parameters: createParam101(lastFace, lastFaceID) });
			});

			// 1行追加
			if (message.length > 0 && !name_tag_only) {
				// Faceが再セットされるタイミングがないのでここで行う
				if (prevFace != lastFace) {
					prevFace = lastFace;
					dest.push({ code: 101, indent: item.indent, parameters: createParam101(lastFace, lastFaceID) });
				}
				dest.push({ code: item.code, indent: item.indent, parameters: [ message ] });
				lineCount++;
			}
		}
	}

	// 101コマンド用の引数を構築します。
	createParam101 = function(faceName, faceID) {
		if (faceID < 0 || faceName == "") {
			return ["", 0, 0, 2];
		} else {
			return [faceName, faceID, 0, 2];
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
			var result = $externMessage.map[value];
			if (result === undefined) {
				list.push(value);
			} else {
				tryReplace(result, list);
			}
		}
		return list;
	};
	
	// keyの一致するコマンドがあった場合にメソッドを呼び出します。
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
			if (str != undefined)
			{
				result += str;
			}
		}
		return (headIdx == 0) ? text : result;
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
})();