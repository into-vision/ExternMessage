# Extern Message

文章を外部CSVファイルで記述するためのRPGツクールMV / MZ 両対応プラグイン  

文章中に直接スクリプトを記述出来るようになりました(2021/04/07 1.3.0～)  

イベントエディター中の文章に「\M[メッセージID]」のように記述しておくことで、テキストエディタ等で編集可能な外部CSVファイル中の文章に置き換えてくれます。  

ただの文章置き換えではなく、4行を超えたら自動で次のページにしたり、名前(※1)や顔グラの設定、イベント呼び出しなどある程度のスクリプト記述が可能です。  
この置き換え機能は事前に変換して焼き込むような方法ではなく、実行時に直接CSVファイルを読み取るのでCSVを編集/保存したら再起動するだけでテキストが反映されます。  

なお条件分岐などはできないので条件分岐が必要な場合はイベントエディターで設定し、条件の前後の文章をCSVファイルで管理することになります。  

このプラグインはRPGツクールMV / MZどちらでもご使用いただけます。(2020/08/22 1.0.4～)  

※1:ツクールMVの場合、名前セット機能は以下のプラグインと連携することを前提としています(ツクールMZでは不要です)  
YEP_MessageCore  

【こういう人にオススメ】  
　・台詞をいっぱい書きたいけどイベントエディターで毎回文章ノードを追加するのが面倒な人  
　・台詞を別ファイルで管理して見渡せるようにしたい人  
　・特殊な単語を気軽にデータベース化したい人  
　・多言語対応したい人(文章が別ファイルなので翻訳が簡単なはず)  

【セットアップ方法】  
　1)「ExternMessage.js」を ./js/pluguins/ フォルダに入れる  
　　以下のファイルを右クリック保存してください  
　　<https://raw.githubusercontent.com/into-vision/ExternMessage/master/src/ExternMessage.js>  

　2)「ExternMessage.csv」を ./data/ フォルダに 「新規作成」する。  
　　読み込みたいcsvファイルの名前は設定で変更可能です。  
　　そもそもcsvファイルって何？って方は検索していただけると嬉しいです...  
　　CSVファイルは以下のようなフォーマットにしてください。  
　　　　メッセージID, メッセージ  
　　　　メッセージID, メッセージ  
　　　　メッセージID, メッセージ  
　エクセルの表示的には1列目にメッセージID、2列目にメッセージとなります。  

【イベントエディター中の「文章」に追加される制御文字】  
\M[メッセージID]  
　CSVファイル内に記述されている一致する「メッセージID」に対応する「メッセージ」へ置き換えます。  

　(ver.1.2.0～)  
　「メッセージID」は「\V[1]」のようなツクール変数を指定することも可能です。  
 　また「TEST_\V[1]」のように連結させて別のメッセージIDを作ることも可能です。  
 　さらに「TEST_\V[SELECT_VALUE]」のようにして「メッセージID」をツクール変数の添字に出来ます。  

【CSVファイル側で有効なコマンド】  
:name[名前, 顔グラのセット名]  
　別ウィンドウの名前表示欄に設定する名前と使用する「顔グラのセット」名を指定します。  
　「顔グラのセット」名は顔グラを使用しない場合は省略できます。  
　また「名前」に「\N[1]」のようなRPGツクールの制御文字を記述することもできます。  
　推奨する使い方として「名前, 顔グラのセット名」をまとめたメッセージIDを定義し、名前と顔グラがずれることを防止します。  

:face[顔グラの番号]  
　現在セットされてる「顔グラのセット」内の指定した番号の顔グラに変更します。  
　推奨する使い方としてすべての顔グラの表情の番号を統一し、  
　「メッセージID」で管理することで文章中でも表情が視認しやすくなります。  

<s>:word[メッセージID]  
　指定したメッセージIDに対応する単語に置き換えます。  
　置き換え後のメッセージは再度検証されないので改行やコマンドを使用しないでください。</s>  
→:word コマンドは廃止になりました(ver.1.1.0～)  
　代わりにエクセル内の文章でも\M[]が使用可能になりました。  

:page  
　次の行を次のページに送ります。  

:event[イベント番号]  
　指定した番号のコモンイベントを呼び出します。  
　推奨する使い方として直接数値を打ち込まずに「メッセージID」で置き換えることで視認性を上げます。  
　仕様としてイベント実行後は必ず改ページされます。(1.0.5 2020/09/12)

:fadeout  
　画面を黒暗転させます。  

:fadein  
　黒暗転状態から画面を表示させます。  

:bg[]
　文章ウィンドウの背景を指定します。(ver.1.1.0～)  
　- :bg[dim] ツクールの「暗くする」に相当します。  
　- :bg[transparent] ツクールの「透明」に相当します。  
　- :bg[window] デフォルトのウィンドウ表示です。  

:layout[]
　文章ウィンドウの位置を指定します。(ver.1.1.0～)  
　- layout[top]:上に表示します  
　- layout[center]:中央に表示します  
　- layout[bottom]:下に表示します。  
  
【上級者向けコマンド】  
:script  
:end  
　(ver.1.3.0～)  
　script～endの間の文章をスクリプトとして解釈します。  
　スクリプトには以下の制限があります。  
　・:script及び:endは必ず行の先頭で記述する必要があります。  
　・スクリプト内はメッセージID等の置換処理は行われません。  
　・実際のスクリプトの実行は、文章の置換処理終了後の「会話」の最中になります。  
　　そのためスクリプトを実行してから\V[n]の値を参照して内容を変更するということはできません。  
　　もし置換処理前にスクリプトを実行したい場合は「:script[immediate]」を使用して下さい。  
　　※イベントエディタ上の文章ウィンドウの「行」単位で置換処理が実行されます。  
　　　そのため通常の「:script」で実行したとしても次の「行」に行けば値を反映した状態にすることもできます。  

:script[immediate]  
:end  
　基本的な使い方は通常のscriptと同じです。  
　唯一の違いは文章コマンドにスタックされず、置換処理の最中にコマンドが見つかったら直ちに実行されます。  
　これにより事前に\V[n]の値を初期化し、使用するメッセージIDを分岐させることも可能です。  
　注意点としてメッセージIDを使用して複雑に階層化された置換処理は必ずしも文章の前方から順番に実行されるわけではありません。  
　確実に先に実行したい場合は「行」の先頭または中身を変えたい\V[n]よりも前の階層あるいは同じ階層の先頭で記述して下さい。  
　会話文が表示される前に実行されるので会話の表示タイミングで画面効果や演出を行いたい場合は通常の「:script」を使用してください。  

【コマンド仕様】  
　・コマンド後ろの「[]」内に「メッセージID」を記述した場合は対応する「メッセージ」に自動で置き換えてくれます。  
　　一致する「メッセージID」が存在しない場合はそのまま使用されます。  

　・「メッセージ」内でもRPGツクールMVデフォルトの制御文字などが使用できます。  
　　原理的にはメッセージを流し直すだけなのでその他の拡張制御文字も使用できる...はず！  
　　<s>ただしメッセージ内に「\M[メッセージID]」は使用できません。</s>  
  　→使用できるようになりました(ver.1.1.0～)  

　・コマンドは「行」内のどこに記述しても実行結果は一緒になります。(ver.1.1.0～)  
　　例えば行の末尾に:fadeoutを記述しても、その行が表示されるタイミングでfadeoutが実行されます。  
　　その行を見終わった後に:fadeoutを実行したい場合は次の行に記述してください。  

　・ツクール変数制御文字 \V[n], \C[n] の添字nにも「メッセージID」を指定できるようにしました(ver.1.2.0～)

【TIPS】  
　csvファイルを直接エクセルなどのファイルで編集するのもありですが、  
　オリジナルのデータは.xlsx/.xlsmなどの拡張子で保存してマクロなどを組むとより便利になります。  
　自分が用意したのは1行あたりの最大文字数をカウントしたりCSV出力ボタンを作って簡単に吐き出せるようにしたりなどです。  
　(VBAマクロがめっちゃ面倒だったのでもし参考にしたいとか要望がありましたらお問い合わせください)  

　必ずしもcsvファイルで全ての文章を管理する必要はありません。  
　短い文章は直接イベントエディターに打ちつつ長文をエクセルで管理するというのは全然ありだと思います。  

【注意事項】  
　使用実績が乏しいのでバグなどあればぜひご報告ください！  
　プラグイン作成経験もないのでお作法と違う部分があれば教えていただけると嬉しいです。  
　RPGツクールでの作成経験もないような人なので実際の作業フローにそぐわない、  
　ここをこうしてほしいなど要望などがありましたらぜひフィードバックをいただければと思います。  
　他のプラグインと競合する場合などもご要望いただければ出来る範囲で対応したいと思います。  
　あと実はすでに似たようなプラグインが有るようならすみません...  

　ver 1.3.0～  
　　置換処理の実行タイミングが変更されました。  
　　これまでイベント開始直後、文章が開始される前にすべての置換処理を行っていましたが、  
　　新仕様では会話中、イベントエディタ上の文章ウィンドウの「行」単位で文章が表示される直前に置換処理が実行されます。  

　　また「YEP_MessageCore」と一部コードが競合する用になります。  
　　これはプラグインの読み込み順番を「YEP_MessageCore」のあとに「ExternMessage」が来るようにすれば併用できます。  
　　ただし「YEP_MessageCore」側の一部機能(たぶん文字数で自動改行する機能)が利用できなくなります。  

　ver 1.3.8～  
　　開発時にこのプラグインに関連する問題に直面した時に事前に察知できるようにいくつかのフェイルセーフを入れました。  
　　主にMessageIDに無効な文字列が設定されていないかどうかチェックされます。  
　　しかしMessageIDの数が多い場合はロード時間が長くなる可能性が高いです。  
　　その場合はプラグイン設定より「Fail Safe」パラメータをOFFにすることで高速化が期待できます。  
　　リリース時にフラグ設定を見直すと幸せになれるかもしれません。  

【ライセンス】  
　MITライセンス  
　製作者: バイザン(@into_vision)  
　非商用利用: 自由  
　商用利用: 自由  
　再配布: OK  
　加工: OK  
　加工後の再配布: OK  
　シリーズ: ツクールMV/MZ  

【バージョン情報】  
　1.3.11 2023/03/28 ValueReferenceColumnIndexで最終列を指定した時に正しく取得できない問題を修正  
　1.3.10 2022/07/30 オリジナルのコマンドに戻す際にインデックスも復元するように対応  
　1.3.9 2022/07/29 範囲外アクセス修正 及び ループcontinue時にコマンドリストをリセットするように修正  
　1.3.8 2022/06/18 ツクールMVのJavaScriptエンジンでは利用できない記述があったので修正  
　　　　　　　　　　レガシーな書き方だった部分も変更  
　　　　　　　　　　プラグイン管理からフェイルセーフ機能の有効/無効を切り替えられるように  
　1.3.7 2022/06/18 MessageIDに数値が指定されていたら例外を出すように  
　　　　　　　　　　波括弧を間違えて使用していた場合のフェイルセーフも追加  
　1.3.6 2022/06/17 ラベルジャンプした後に展開情報が残ったままになる問題を修正  
　　　　　　　　　　スクリプトも再実行されるように改良  
　1.3.5 2022/05/24 展開された情報が変に残ってしまう問題を修正  
　1.3.4 2022/05/23 改行付き変数で置き換えられた後再表示されたときにメッセージが増えていく問題を修正  
　1.3.3 2022/03/29 csvファイルに空のセルが存在すると空文字が有効なMessasgeIDとして解釈されてしまう問題の修正  
　1.3.2 2021/06/29 メッセージが2回目以降に変更されない問題の修正  
　1.3.1 2021/04/23 csv文字コード対応。プラグインの設定からutf-8などを指定できます  
　1.3.0 2021/04/05 直接スクリプトが記述できるように  
　　　　　　　　　　多言語対応向けに参照する列番号を指定できるように  
　1.2.1 2021/04/04 エクセルを介さず「文章」で「\M[\V[0]]」のように変数を添え字にすると不正なIDとされる問題の修正  
　　　　　　　　　　「\V[メッセージID]」が表示できない問題の修正  
　　　　　　　　　　MZ向けにアノテーションを指定。  
　1.2.0 2021/03/06 ツクール変数を添字に指定できるように  
　　　　　　　　　　ツクール変数の添字にもメッセージIDを指定できるように  
　1.1.0 2020/09/23 Window関連のコマンド追加。:wordを廃止。代わりに再起コマンド実行可能なテキスト置き換え機能実装  
　1.0.7 2020/09/22 MZではさらにsetupNewGameが細分化されていたので共通して呼び出される場所で初期化するように  
　1.0.6 2020/09/22 イベントテスト/戦闘テスト実行時に'TEST_'の接頭語をつけて読み込まれる仕様を回避するように  
　1.0.5 2020/09/12 イベントコマンド実行後のメッセージが表示されない問題の修正  
　1.0.4 2020/08/22 ツクールMZに対応。具体的には名前ウィンドウ対応  
　1.0.3 2020/07/17 最終行の読み取りエラー修正  
　1.0.2 2020/07/16 CRLF(\r\n)改行だとうまく動かない問題に対応  
　　　　　　　　　　パラメーターにセフティー処理追加  
　1.0.1 2020/04/25 CSVファイル1行目をヘッダー扱いにしてた仕様を削除  
　1.0.0 2020/04/25 初版公開  
