import os
import json
import pandas as pd

def convert_excel_to_json():
    # 设定文件名
    excel_file = "songlist.xlsx"
    json_file = "songs.json"
    
    print("====== 📡 正在启动歌单电波解析工具 ======")
    
    # 1. 检查 Excel 文件是否存在
    if not os.path.exists(excel_file):
        print(f"❌ 错误：在当前目录下未找到【{excel_file}】文件！")
        print("💡 请确保 Excel 文件命名正确，且与本脚本放在同一个文件夹内。")
        return

    try:
        # 2. 读取 Excel 文件
        print(f"📖 正在读取 {excel_file}...")
        # read_excel 会自动识别表头，请确保你的 Excel 第一行表头是：id | 标题 | 艺术家 | 嵌入代码 (或英文 id | title | artist | embed)
        df = pd.read_excel(excel_file)
        
        # 清洗数据：去除全空的行
        df = df.dropna(how='all')
        
        # 3. 映射并规范化列名（兼容中英文表头）
        column_mapping = {
            'id': 'id', 'ID': 'id', '序号': 'id',
            '标题': 'title', 'title': 'title', '歌名': 'title',
            '艺术家': 'artist', 'artist': 'artist', '歌手': 'artist', '作者': 'artist',
            '嵌入代码': 'embed', 'embed': 'embed', '链接': 'embed'
        }
        
        # 重命名列
        df = df.rename(columns=column_mapping)
        
        # 检查必要的四个核心列是否存在
        required_cols = ['id', 'title', 'artist', 'embed']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            print(f"❌ 错误：Excel 中缺少必要的列或表头无法识别：{missing_cols}")
            print("💡 请确保表头包含：'id'、'标题'、'艺术家'、'嵌入代码'")
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
                
            title = str(row['title']).strip()
            artist = str(row['artist']).strip()
            embed_code = str(row['embed']).strip()
            
            # 核心处理：移除嵌入代码中不小心夹杂的换行或多余首尾空格
            embed_code = embed_code.replace('\n', '').replace('\r', '')
            
            # 组装单条数据
            songs_list.append({
                "id": song_id,
                "title": title,
                "artist": artist,
                "embed": embed_code  # Python 的 json.dump 会自动帮你处理里面的双引号转义 \"
            })

        # 5. 写入 JSON 文件
        print(f"✍️ 正在生成标准 JSON 并注入数据...")
        with open(json_file, 'w', encoding='utf-8') as f:
            # ensure_ascii=False 保证中文不变成 unicode 编码 (\uXXXX)
            # indent=2 保证生成的 JSON 带有漂亮的缩进，方便肉眼检查
            json.dump(songs_list, f, ensure_ascii=False, indent=2)
            
        print(f"✨ 成功！已生成标准歌单文件：【{json_file}】 (共打包了 {len(songs_list)} 首歌曲)")
        print("=========================================")

    except Exception as e:
        print(f"❌ 运行过程中发生未知错误: {e}")

if __name__ == "__main__":
    convert_excel_to_json()