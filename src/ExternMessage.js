/*:
 * @plugindesc Include message from external file.
 * @author Baizan(twitter:into_vision)
 * @target MZ
 * @version 1.3.7
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
 * @param Csv File Encode
 * @desc
 * @default shift_jis
 * @type string
 * 
 * @param Use Name Tag
 * @desc
 * @default true
 * @type boolean
 * 
 * @param Default Reference Column Index
 * @desc
 * @default 1
 * @type number
 */

/*:ja
 * @plugindesc 外部ファイルから文章を読み取ります。
 * @author バイザン(twitter:into_vision)
 * @target MZ
 * @version 1.3.7
 * 		1.3.7 2022/06/18	MessageIDに数値が指定されていたら例外を出すように。波括弧を間違えて使用していた場合のフェイルセーフも追加。
 * 		1.3.6 2022/06/17	ラベルジャンプした後に展開情報が残ったままになる問題を修正
 * 							スクリプトも再実行されるように改良
 * 		1.3.5 2022/05/24	展開された情報が変に残ってしまう問題を修正
 * 		1.3.4 2022/05/23	改行付き変数で置き換えられた後再表示されたときにメッセージが増えていく問題を修正
 * 		1.3.3 2022/03/29	csvファイルに空のセルが存在すると空文字が有効なMessasgeIDとして解釈されてしまう問題の修正
 * 		1.3.2 2021/06/29	メッセージが2回目以降に変更されない問題の修正
 * 		1.3.1 2021/04/23	文字のエンコード方式を指定できるように
 * 		1.3.0 2021/04/05	直接スクリプトが記述できるように
 * 							多言語対応向けに参照する列番号を指定できるように
 * 		1.2.1 2021/04/04	エクセルを介さず「文章」で「\M[\V[0]]」のように変数を添え字にすると不正なIDとされる問題の修正。
 * 							「\V[メッセージID]」が表示できない問題の修正。
 * 							MZ向けにアノテーションを指定。
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
 * @param Csv File Encode
 * @desc csvファイルのエンコード方式。一般的に「shift_jis」または「utf-8」を指定する。
 * @default shift_jis
 * @type string
 * 
 * @param Use Name Tag
 * @desc :nameコマンドを使用した際に名前タグを挿入します。
 * @default true
 * @type boolean
 * 
 * @param Default Reference Column Index
 * @desc デフォルトで値として参照するcsvの列番号
 * @default 1
 * @type number
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
 *   
 * 【上級者向けコマンド】
 *   :script
 *   :end
 *   	script～endの間の文章をスクリプトとして解釈します。
 *   	スクリプトには以下の制限があります。
 *   	・:script及び:endは必ず行の先頭で記述する必要があります。
 *   	・スクリプト内はメッセージID等の置換処理は行われません。
 *   	・実際のスクリプトの実行は、文章の置換処理終了後の「会話」の最中になります。
 *   	　そのためスクリプトを実行してから\V[n]の値を参照して内容を変更するということはできません。
 *   	　もし置換処理前にスクリプトを実行したい場合は「:script[immediate]」を使用して下さい。
 * 
 *   	　※イベントエディタ上の文章ウィンドウの「行」単位で置換処理が実行されます。
 *   	　　そのため通常の「:script」で実行したとしても次の「行」に行けば値を反映した状態にすることもできます。
 *   	　
 *   :script[immediate]
 *   :end
 *   	基本的な使い方は通常のscriptと同じです。
 *   	唯一の違いは文章コマンドにスタックされず、置換処理の最中にコマンドが見つかったら直ちに実行されます。
 *   	これにより事前に\V[n]の値を初期化し、使用するメッセージIDを分岐させることも可能です。
 *   	注意点としてメッセージIDを使用して複雑に階層化された置換処理は必ずしも文章の前方から順番に実行されるわけではありません。
 *   	「行」の先頭または中身を変えたい\V[n]よりも前の階層あるいは同じ階層の先頭で記述して下さい。
 *   	会話文が表示される前に実行されるので会話の表示タイミングで画面効果や演出を行いたい場合は通常の「:script」を使用してください。
 */

//---------------------------------------------------------------------------------------------
// ExternMessage データーベース
//---------------------------------------------------------------------------------------------
var $externMessage =
{
	setup: function() {
		// setupはゲーム起動時の他ロード時でも呼ばれる。
		// しかし内部データは書き換えることは(少なくともこのプラグインでは)無いのでスキップする。
		if (this._map) {
			return;
		}

		// 改行コードを置き換え
		$externMessageCSV = $externMessageCSV.replace("\r\n", "\n");

		// 2次元配列に変換
		var result = CsvImportor.parseFromCSV($externMessageCSV);

		this._map = new Array();
		for(var i = 0; i < result.length; i++)
		{
			var currentLine = result[i];
			var messageID = currentLine[0];
			// csvファイル末尾に空のセルが追加されている可能性がある
			if(messageID === '') {
				continue;
			}
			if(!isNaN(messageID)) {
				throw new Error("ExternalMessage: Do not use numeric-only MessageID.\n(MessageIDは数値のみで登録してはいけません。)");
			}
			// 多言語対応のため2列目以降をすべて取得
			this._map[messageID] = currentLine.slice(1);
		}
	},

	// keyに一致する要素を取得します。
	getValue: function(key) {
		// 空の文字含めて常に無効値とする
		if(key === '' || key === null || key === undefined) {
			return undefined;
		}
		var line = this._map[key];
		if(!line) {
			return undefined;
		}

		// 指定列がない場合は場合はcsv要素の1列目を使用する。
		if(line.length <= this.ValueReferenceColumnIndex) {
			return line[0];
		}
		return line[this.ValueReferenceColumnIndex - 1];
	},

	// valueが参照するcsvの列番号
	// 例えば複数言語を一つのcsvで管理する場合はこの番号で切り替える事ができる。
	ValueReferenceColumnIndex: 1,
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
	$externMessage.CsvFileEncode = String(safety('Csv File Encode', 'shift_jis'));
	$externMessage.UseNameTag = safety('Use Name Tag', 'true') === 'true';
	$externMessage.ValueReferenceColumnIndex = Number(safety('Default Reference Column Index', '1'));

	// DataManagerへ読み込みの予約とセットアップの予約
	DataManager._databaseFiles.push({ name:'$externMessageCSV',	src:$externMessage.CsvFilePath	});

	// もともとsetupNewGame時に呼ぶようにしていたが、MZではsetupNewGame/setupBattleTest/setupEventTestで細分化された。
	// そのため各setupで共通して呼び出されているcreateGameObjectsで初回のみセットアップするように変更
	var _DataManager_createGameObjects = DataManager.createGameObjects;
	DataManager.createGameObjects = function() {
		_DataManager_createGameObjects.apply(this, arguments);
		$externMessage.setup();

		if ($externMessage.replaceCommand101 != Game_Interpreter.prototype.command101) {
			alert("Game_Interpreter.prototype.command101が別のプラグインによってオーバーライドされています。\nもしYEP_MessageCoreをご利用の場合はプラグインの順番をExternalMessageよりも前に変更して下さい。");
		}
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
		xhr.overrideMimeType(`text/plain; charset=${$externMessage.CsvFileEncode}`);
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
	// command101 新規文章ウィンドウの表示 をオーバーライドし逐次コマンド実行を行う
	// このメソッドはオリジナルのcommand101コードを引用しています。
	Game_Interpreter.prototype.command101 = function(params) {
		if ($gameMessage.isBusy()) {
			return false;
		}

		// MZ互換
		if (params === undefined) {
			params = this._params;
		}

		$gameMessage.setFaceImage(params[0], params[1]);
		$gameMessage.setBackground(params[2]);
		$gameMessage.setPositionType(params[3]);
		if (!isGameMakerMV()) { // MZ互換
			$gameMessage.setSpeakerName(params[4]);
		}

		while (this.nextEventCode() === 401) {  // Text data
			this._index++;
			var item = this.currentCommand();
	
			// 401文章コマンドを展開
			var replaced = convertMessageCommand(item);

			// 何も展開されなかったらそのまま登録
			if (replaced.length === 1 && commandEqual(replaced[0], item)) {
				$gameMessage.add(item.parameters[0]);
			} else {
				// 初回展開時にオリジナルを控えておく
				// そうすることでDBから渡ってくるオリジナルのリストを書き換えずに済み
				// 他にもラベルジャンプ時に元に戻すことも出来る
				if(!this._originalList) {
					this._originalList = this._list;
					this._list = this._list.slice();
				}
				// 元のリストのクローンなので差し替えても問題ない
				this._list.splice(this._index, 1, ...replaced);
				this._index--;
			}
		}
		switch (this.nextEventCode()) {
		case 102:  // Show Choices
			this._index++;
			this.setupChoices(this.currentCommand().parameters);
			break;
		case 103:  // Input Number
			this._index++;
			this.setupNumInput(this.currentCommand().parameters);
			break;
		case 104:  // Select Item
			this._index++;
			this.setupItemChoice(this.currentCommand().parameters);
			break;
		}

		if (isGameMakerMV()) {
			this._index++;
			this.setWaitMode('message');
			return false;
		} else {
			this.setWaitMode('message');
			return true;
		}
	};

	// 後で他のプラグインがオーバーライドした場合のチェック用に控える
	$externMessage.replaceCommand101 = Game_Interpreter.prototype.command101;

	// ラベルジャンプした場合はリスト上のスクリプトを再実行させる必要があるので差し替えたリストを元に戻してからジャンプさせる
	const _Game_Interpreter_command119 = Game_Interpreter.prototype.command119;
	Game_Interpreter.prototype.command119 = function(params) {
		// 既にオリジナルと置き換えられていたら元に戻す。
		this._list = this._originalList ?? this._list;
		this._originalList = null;
		// jump処理でオーバーランする可能性があるので丸める。
		this._index = Math.min(this._index, this._list.length);
		_Game_Interpreter_command119.apply(this, arguments);
	};

	// 会話開始時に初期化する
	const _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
	Game_Interpreter.prototype.clear = function() {
		this._originalList = null;
		_Game_Interpreter_clear.apply(this, arguments);
	};

	// メッセージコマンドを変換する
	convertMessageCommand = function(item)
	{
		var context = {
			lastName: "",
			lastFace: "",
			lastFaceID: 0,
			lineCount: 0,
			windowMode: 0, // 0:通常, 1:暗く, 2:透明
			layoutMode: 2, // 0:上, 1中, 2下
			indent: item.indent,
		};

		// 文章の場合は必ず1行
		// 参照:Game_Interpreter.prototype.command101
		var dest = new Array();
		this.convertMessageCommandCore(dest, item.parameters[0], context, 0);
		return dest;
	}

	// 現在の行にスクリプトの開始コマンドがある場合はendまでをスクリプトとしてコンバートする関数
	convertScript = function(messages, idx)
	{
		// 先頭タグをチェックするラムダ式
		var headTagCheck = (str, tag) => {
			// デバッグ中はタグが先頭にあるかチェックを行う
			if ($gameTemp.isPlaytest()) {
				var checkIdx = str.indexOf(tag);
				if (checkIdx < 0) {
					return false;
				} else if(checkIdx != 0) {
					alert(tag + "は必ず先頭で記述する必要があります。");
				} else if(checkIdx == 0 && str != tag) {
					alert("この行にタグ以外を記述している、または無効な引数です。");
				}
			} else {
				// 通常はイコール比較だけで良い
				if (str != tag) {
					return false;
				}
			}
			return true;
		};
		
		// immediateスクリプトの場合は文章置換前に即時実行する。
		var immediate = false;
		if (headTagCheck(messages[idx], ":script[immediate]")) {
			immediate = true;
		} else if(!headTagCheck(messages[idx], ":script")) {
			return null; // この行が:scriptではないならスキップ
		}

		// :endタグが見つかるまで結合
		var source = "";
		for (idx++; idx < messages.length; idx++)
		{
			var message = messages[idx];
			if(headTagCheck(message, ":end")) {
				return { scopeEndIdx: idx, source: source, immediate: immediate };
			} else {
				// デバッグ中は簡易文法チェックを行う
				if($gameTemp.isPlaytest()) {
					if(message.indexOf('""') >= 0) {
						alert('スクリプト中に「"」(ダブルクォート)を使用しないで下さい。これはcsvファイルでは「""」(2つのダブルクォート)に変換されてしまうためです。');
						return { failed: true };
					}
				}
				// 式の途中で複数行に分割されている場合に改行が消えてるとまずい
				source += message + "\n";
			}
		}

		alert("スクリプトが :endタグ で閉じられていません。");
		return { failed: true };
	}

	// メッセージIDの展開を行います。
	// dest: コマンドの置き換え用配列
	// text: 処理する1行分の文章コマンドのテキスト
	// context: 各種再帰処理で引き継ぐ情報
	// depth: 再帰処理の深度。0でオリジナルの文章コマンドからの呼び出し。
	convertMessageCommandCore = function(dest, text, context, depth)
	{
		// 改行ごとに別メッセージとして処理
		var messages = text.split("\n");

		for (var i = 0; i < messages.length; ++i)
		{
			var message = messages[i];

			//----------------------------------------------------------------------------
			// parse script.
			//----------------------------------------------------------------------------
			// scriptの解析
			// messageが「:script」なら「:end」までをscriptとして処理する。
			// この処理は一番最初に行い、script内に制御文字があってもスキップさせる。
			// ただし、ツクールの文章ウィンドウでベタ書きしてはいけない。
			// 理由としては文章ウィンドウでは4行以上記述できないのと複数コマンドとして分割されてしまい解決が難しいため
			if(depth > 0)
			{
				var script = this.convertScript(messages, i);
				if (script && script.failed) {
					break; // 異常終了処理
				}

				// 有効なscriptが見つかったなら追加または実行し次の行へ
				if (script) {
					i = script.scopeEndIdx;
					// immediateモードの場合は直ちに実行
					if (script.immediate) {
						eval(script.source);
					} else {
						dest.push({ code: 355, indent: context.indent, parameters: [ script.source ] });
					}
					continue;
				}
			}
			// デバッグ中は簡易文法チェックを行う
			else if($gameTemp.isPlaytest())
			{
				if(message.indexOf(':script') >= 0) {
					alert('イベントエディタの文章ウィンドウに直接スクリプトを書くのは禁止されています。');
					break;
				}
			}

			//----------------------------------------------------------------------------
			// replace message id.
			//----------------------------------------------------------------------------
			// ツクール変数の添え字もメッセージIDに対応
			// \P[n], \N[n]もあるが対応する必要性が余り感じられないので様子見
			message = parseCmd(message, "\\V", args => {
				args = tryReplace(args);
				return $gameVariables.value(parseInt(args)).toString();
			});
			message = parseCmd(message, "\\C", args => {
				return tryReplace(args);
			});

			// 単語を置き換える。再起コマンド実行可能。
			var textFound = false;
			message = parseCmd(message, "\\M", args => {
				textFound = true;
				return tryReplace(args);
			});

			// textの置き換えが発生したら再帰処理を行い、置き換え後の文章を再処理する。
			if (textFound) {
				// text置き換え及び前後の文字がすべて結合した状態になっている
				// 文章開始:text[TEST]文章終了→文章開始 置き換え文章 文章終了
				this.convertMessageCommandCore(dest, message, context, depth + 1);

				// 既に処理済みなのでこの行に関しては後続の処理はスキップして良い
				continue;
			}

			//----------------------------------------------------------------------------
			// replace commands.
			//----------------------------------------------------------------------------
			// 名前の取り出し
			message = parseCmd(message, ":name", args => {
				args = tryReplaceMultiArgs(args);
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
				context.lastFaceID = tryReplace(args);
				context.lineCount = $externMessage.LineMax;
			});
			// :pageが含まれていたら次の行でページ送りさせる。
			message = parseCmd(message, ":page", args => {
				context.lineCount = $externMessage.LineMax;
			});
			// コモンイベントの呼び出し
			message = parseCmd(message, ":event", args => {
				var id = tryReplace(args);
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
	tryReplace = function(value) {
		var result = $externMessage.getValue(value.trim());
		if (result === undefined) {
			return value;
		} else {
			return tryReplace(result);
		}
	};
	
	// 複数引数が含まれる可能性のあるばあいは,で区切って再展開する。
	tryReplaceMultiArgs = function(value, list) {
		value = value.trim()
		if (list === undefined) {
			list = new Array();
		}
		if (value.includes(',')) {
			for (const v of value.split(',')) {
				tryReplaceMultiArgs(v, list);
			}
		} else {
			var result = $externMessage.getValue(value);
			if (result === undefined) {
				list.push(value);
			} else {
				tryReplaceMultiArgs(result, list);
			}
		}
		return list;
	};

	// keyに一致するコマンドがあった場合にメソッドを呼び出します。
	// 続けて[]が付与されていたら引数として解釈します。
	parseCmd = function(text, key, call) {
		if (text.length === 0) {
			return text;
		}
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
		// 開発時用の保険処理
		if(text[idx] === '{') {
			throw new Error("ExternalMessage: Use square brackets \"[]\" instead of curly brackets \"{}\" to specify arguments.\n(引数の指定には 波括弧\"{}\" ではなく 角括弧\"[]\" を使用してください。)");
		}

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

	// ２つのコマンドが等しいかチェック
	commandEqual = function(commandX, commandY) {
		if(commandX.code != commandY.code) {
			return false;
		}
		if(commandX.parameters.length != commandY.parameters.length) {
			return false;
		}
		for(var i = 0; i < commandX.parameters.length; i++) {
			if(commandX.parameters[i] != commandY.parameters[i]) {
				return false;
			}
		}
		return true;
	}

	isGameMakerMV = function() {
		return Utils.RPGMAKER_NAME === "MV";
	}
})();
