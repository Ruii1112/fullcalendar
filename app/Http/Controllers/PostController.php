<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return view('calendars.calendar');
    }
    
    public function create(Request $request, Post $post)
    {
        $request->validate([
            'event_title' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
        ]);

        $input = [
            'title' => $request->input('event_title'),
            'body' => $request->input('event_body'),
            'start' => $request->input('start_date'),
            'user_id' => \Auth::id(),
        ];
        
        if(!($request->input("start_time") === "00:00:00" && $request->input("end_time") === "00:00:00")){
            $input += [
                'start_time' => $request->input("start_time"),
                'end_time' => $request->input("end_time"),
                'end' => date("Y-m-d", strtotime($request->input('end_date'))),
            ];
        }else{
            $input += [
                'end' => date("Y-m-d", strtotime("{$request->input('end_date')} +1 day")),
            ];
        }
        
        $post->fill($input)->save();
        
        return redirect('/calendar');
    }
    
    public function get(Request $request, Post $post)
    {
        $request->validate([
            'start_date' => 'required|integer',
            'end_date' => 'required|integer'
        ]);

        $start_date = date('Y-m-d', $request->input('start_date') / 1000);
        $end_date = date('Y-m-d', $request->input('end_date') / 1000);
        
        $posts = $post->where('end', '>', $start_date)
                      ->where('start', '<', $end_date)
                      ->where('user_id', \Auth::id())
                      ->get();
        
        $res = [];
        
        foreach($posts as $data){
            if($data->start_time && $data->end_time){
                $res[] = [
                    'id' => $data->id,
                    'title' => $data->title,
                    'description' => $data->body,
                    'start' => $data->start . "T" . $data->start_time,
                    'end' => $data->end . "T" . $data->end_time,
                ];
            }else{
                $res[] = [
                    'id' => $data->id,
                    'title' => $data->title,
                    'description' => $data->body,
                    'start' => $data->start,
                    'end' => $data->end,
                ];
            }
        }
        
        return response()->json($res);
    }
}
