# ExternalMessage
文章を外部CSVファイルで記述するためのRPGツクールMV / MZ 両対応プラグイン  


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
　1)「ExternalMessage.js」を ./js/pluguins/ フォルダに入れる  
　　以下のファイルを右クリック保存してください  
　　https://raw.githubusercontent.com/into-vision/ExternalMessage/master/src/ExternMessage.js  

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


:word[メッセージID]  
　指定したメッセージIDに対応する単語に置き換えます。  
　置き換え後のメッセージは再度検証されないので改行やコマンドを使用しないでください。  


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


【コマンド仕様】  
　・コマンド後ろの「[]」内に「メッセージID」を記述した場合は対応する「メッセージ」に自動で置き換えてくれます。  
　　一致する「メッセージID」が存在しない場合はそのまま使用されます。  

　・「メッセージ」内でもRPGツクールMVデフォルトの制御文字などが使用できます。  
　　原理的にはメッセージを流し直すだけなのでその他の拡張制御文字も使用できる...はず！  
　　ただしメッセージ内に「\M[メッセージID]」は使用できません。  


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
　1.0.5 2020/09/12	イベントコマンド実行後のメッセージが表示されない問題の修正  
　1.0.4 2020/08/22 ツクールMZに対応。具体的には名前ウィンドウ対応  
　1.0.3 2020/07/17 最終行の読み取りエラー修正  
　1.0.2 2020/07/16 CRLF(\r\n)改行だとうまく動かない問題に対応  
　　　　　　　　　パラメーターにセフティー処理追加  
　1.0.1 2020/04/25 CSVファイル1行目をヘッダー扱いにしてた仕様を削除  
　1.0.0 2020/04/25 初版公開  
