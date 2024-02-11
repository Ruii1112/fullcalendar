<x-app-layout>
    <div id='calendar'></div>
<!-- カレンダー新規追加モーダル -->
    <div id="modal-add" class="modal">
        <div class="modal-contents">
            <form method="POST" action="/calendar/create">
                @csrf
                <input id="new-id" type="hidden" name="id" value="" />
                <label for="event_title">タイトル</label>
                <input id="new-event_title" class="input-title" type="text" name="event_title" value="" />
                <label for="start_date">開始日時</label>
                <input id="new-start_date" class="input-date" type="date" name="start_date" value="" />
                <input type="time" class="time" id="new-start_time" name="start_time" />
                <label for="end_date">終了日時</label>
                <input id="new-end_date" class="input-date" type="date" name="end_date" value="" />
                <input type="time" class="time" id="new-end_time" name="end_time" />
                <br>
                <label for="all_day">終日</label>
                <input type="checkbox" name="all_day" id="all_day" checked />
                <label for="event_body" style="display: block">内容</label>
                <textarea id="new-event_body" name="event_body" rows="3" value=""></textarea>
                <button type="button" onclick="closeAddModal()">キャンセル</button>
                <button type="submit" id="decision">決定</button>
            </form>
        </div>
    </div>
    
<style scoped>
/* モーダルのオーバーレイ */
.modal{
    display: none; /* モーダル開くとflexに変更（ここの切り替えでモーダルの表示非表示をコントロール） */
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 10; /* カレンダーの曜日表示がz-index=2のため、それ以上にする必要あり */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,0.5);
}
/* モーダル */
.modal-contents{
    background-color: white;
    height: 400px;
    width: 800px;
    padding: 20px;
}

/* 以下モーダル内要素のデザイン調整 */
input{
    padding: 2px;
    border: 1px solid black;
    border-radius: 5px;
}
.input-title{
    display: block;
    width: 80%;
    margin: 0 0 20px;
}
.input-date{
    width: 20%;
    margin: 0 5px 20px 0;
}
textarea{
    display: block;
    width: 80%;
    margin: 0 0 20px;
    padding: 2px;
    border: 1px solid black;
    border-radius: 5px;
    resize: none;
}
select{
    display: block;
    width: 20%;
    margin: 0 0 20px;
    padding: 2px;
    border: 1px solid black;
    border-radius: 5px;
}
.time{
    display: none;
}
</style>
</x-app-layout>