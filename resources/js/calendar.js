import axios from "axios";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// 日付をyyyy-mm-ddに変換
const formatDate = (date, info, allDay) => {
    const dt = new Date(date);
    if(info === 'endDate' && allDay){
        dt.setDate(dt.getDate() - 1);
    }
    return dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
}

// 日付をhh:mm:ssに変換
const formatTime = (date, info) => {
    const dt = new Date(date);
    return ('0' + dt.getHours()).slice(-2) + ':' + ('0' + dt.getMinutes()).slice(-2) + ':' + ('0' + dt.getSeconds()).slice(-2);
}

let calendarInitialView;
const calendarEl = document.getElementById("calendar");

if(calendarEl){
    // sessionStorageからinitialViewの情報を取得
    calendarInitialView = sessionStorage.getItem('view') ? sessionStorage.getItem('view') : "dayGridMonth";
    
    // 終日のチェックボックスの操作
    const dateTime = document.getElementById("all_day");
    dateTime.addEventListener('change', () => {
        document.getElementById('new-start_time').classList.toggle('time');
        document.getElementById('new-end_time').classList.toggle('time');
        if(document.getElementById('new-start_time').value){
            document.getElementById('new-start_time').value = "";
        }
        if(document.getElementById('new-end_time').value){
            document.getElementById('new-end_time').value = "";
        }
    });
    
    // fullcalendarのインスタンス化
    const calendar = new Calendar(calendarEl, {
        
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    
        // カレンダー表示
        initialView: calendarInitialView,
        headerToolbar: {
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        height: "auto",
        locale: 'ja', //日本語対応
        buttonText: { //設置してあるボタンの日本語化
            month: '月',
            week: '週',
            day: '日'
        },
        
        // 予定の表示
        eventClick: (info) => {
            console.log(info.event);
            
            // DOMにデータのセット
            document.getElementById("new-id").value = info.event.id;
            document.getElementById("new-event_title").value = info.event.title;
            document.getElementById("new-event_body").value = info.event.extendedProps.description;
            document.getElementById("new-start_date").value = formatDate(info.event.start);
            document.getElementById("new-end_date").value = formatDate(info.event.end, 'endDate', info.event.allDay);
            document.getElementById('new-start_time').value = info.event.allDay ? '' : formatTime(info.event.start);
            document.getElementById('new-end_time').value = info.event.allDay ? '' : formatTime(info.event.end);

            document.getElementById('modal-add').style.display = 'flex';
            
            // 終日のチェックボックスの有無
            if(info.event.allDay){
                dateTime.checked = true;
                document.getElementById('new-start_time').classList.add('time');
                document.getElementById('new-end_time').classList.add('time');
            }else{
                dateTime.checked = false;
                document.getElementById('new-start_time').classList.remove('time');
                document.getElementById('new-end_time').classList.remove('time');
            }
            
            document.getElementById('decision').style.display = 'none';
        },
        // カレンダーで日程を指定して新規予定追加
        selectable: true,
        select: (info) => {
            document.getElementById('decision').style.display = 'inline';
            
            // 終日選択か否かでモーダルの終日チェックボックスの解除
            if(info.allDay){
                dateTime.checked = true;
                document.getElementById('new-start_time').classList.add('time');
                document.getElementById('new-end_time').classList.add('time');
            }else{
                dateTime.checked = false;
                document.getElementById('new-start_time').classList.remove('time');
                document.getElementById('new-end_time').classList.remove('time');
            }

            // DOMにデータのセット
            document.getElementById("new-id").value = "";
            document.getElementById("new-event_title").value = "";
            document.getElementById("new-start_date").value = formatDate(info.start);
            document.getElementById('new-start_time').value = formatTime(info.start);
            document.getElementById("new-end_date").value = formatDate(info.end, 'endDate', info.allDay);
            document.getElementById('new-end_time').value = formatTime(info.end);
            document.getElementById("new-event_body").value = "";
            
            document.getElementById('modal-add').style.display = 'flex';
            
            // sessionStorageにinitialViewデータの格納
            sessionStorage.setItem('view', calendar.view.type);
        },
        
        // DBに登録した予定を表示する
        events: (info, successCallback, failureCallback) => { // eventsはページが切り替わるたびに実行される
            axios
                .post("/calendar/get", {
                    start_date: info.start.valueOf(),
                    end_date: info.end.valueOf(),
                })
                .then((res) => {
                    // 既に表示されているイベントを削除（重複防止）
                    calendar.removeAllEvents();
                    // カレンダーに読み込み
                    successCallback(res.data); // successCallbackに予定をオブジェクト型で入れるとカレンダーに表示できる
                })
                .catch((error) => {
                    console.log(error);
                    alert("登録に失敗しました。");
                });
        },
    });
    
    // カレンダーのレンダリング
    calendar.render();
    
    window.closeAddModal = () => {
        document.getElementById('modal-add').style.display = 'none';
    }
}