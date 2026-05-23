import os
import json
import pandas as pd

def convert_excel_to_json():
    excel_file = "songlist.xlsx"
    json_file = "songs.json"
    
    if not os.path.exists(excel_file):
        print(f"❌ 错误：在当前目录下未找到【{excel_file}】文件！")
        print("💡 请确保 Excel 文件命名正确，且与本脚本放在同一个文件夹内。")
        return

    try:
        print(f"📖 正在读取 {excel_file}...")
        df = pd.read_excel(excel_file)
        
        df = df.dropna(how='all')
        
        column_mapping = {
            'id': 'id', 'ID': 'id', '序号': 'id',
            '标题': 'title', 'title': 'title', '歌名': 'title',
            '艺术家': 'artist', 'artist': 'artist', '歌手': 'artist', '作者': 'artist',
            '嵌入代码': 'embed', 'embed': 'embed', '链接': 'embed',
            'bpm': 'bpm', 'BPM': 'bpm', 'length': 'length', '时长': 'length', 'source': 'source', '来源': 'source'
        }
        
        df = df.rename(columns=column_mapping)
        
        # 检查必要的四个核心列是否存在
        required_cols = ['id', 'title', 'artist', 'embed','bpm','length','source']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            print(f"❌ 错误：Excel 中缺少必要的列或表头无法识别：{missing_cols}")
            return

        # 4. 转换数据类型与清洗
        songs_list = []
        for index, row in df.iterrows():
            # 确保 ID 是纯数字整数
            try:
                song_id = int(float(row['id']))
            except (ValueError, TypeError):
                print(f"⚠️ 警告：第 {index+2} 行的 ID '{row['id']}' 不是有效数字，已跳过。")
                continue
            length = str(row.get('length', '--:--')).strip()
            if length == 'nan' or not length:
                length = '--:--'
                
            raw_bpm = row.get('bpm', 0)
            try:
                if pd.isna(raw_bpm) or str(raw_bpm).strip() == 'nan':
                    bpm = 0
                else:
                    bpm = int(float(raw_bpm))
            except (ValueError, TypeError):
                bpm = 0
                
            source = str(row.get('source', '')).strip()
            if source == 'NaN':
                source = ""
                
            title = str(row['title']).strip()
            artist = str(row['artist']).strip()
            embed_code = str(row['embed']).strip()
            embed_code = embed_code.replace('\n', '').replace('\r', '')
            songs_list.append({
                "id": song_id,
                "title": title,
                "artist": artist,
                "embed": embed_code,
                "bpm": bpm,
                "length": length,
                "source": source
            })

        # 5. 写入 JSON 文件
        print(f"✍️ 正在生成标准 JSON 并注入数据...")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(songs_list, f, ensure_ascii=False, indent=2)
            
        print(f"✨ 成功！已生成标准歌单文件：【{json_file}】 (共打包了 {len(songs_list)} 首歌曲)")

    except Exception as e:
        print(f"❌ 运行过程中发生未知错误: {e}")

if __name__ == "__main__":
    convert_excel_to_json()