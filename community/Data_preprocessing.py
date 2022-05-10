# 초성 / 중성 / 종성으로 분리하는 코드

def data_split(result):    
    '''
    초성 중성 종성 나누기
    '''
    consonant_ord_list = [ord(char) for char in "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"] # 초성 유니코드 리스트
    choseong_list = [char for char in "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"] # 초성리스트
    jungseong_list = [char for char in "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"] # 중성 리스트
    jongseong_list = [char for char in "-ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"] # 종성 리스트
    tmp = []
    
    for char in result:
        if ord(char)==32: # 띄어쓰기인 경우
            tmp.append(char)
            
        elif 48<=ord(char)<=57: # 숫자인 경우
            tmp.append(char)
            
        elif consonant_ord_list.count(char) == 0:
            character_code = ord(char)
            
            if (55203 < character_code or character_code < 44032):
                continue
                
            code = 44032
            choseong_index = (character_code - code) // 21 // 28
            jungseong_index = (character_code - code - (choseong_index * 21 * 28)) // 28
            jongseong_index = character_code - code - (choseong_index * 21 * 28) - (jungseong_index * 28)
            tmp.append(choseong_list[choseong_index])
            tmp.append(jungseong_list[jungseong_index])
            tmp.append(jongseong_list[jongseong_index])
            
        else:
            choseong_index = consonant_ord_list.index(ord(char))
            tmp.append(choseong_list[choseong_index])
            tmp.append("-")
            tmp.append("-")
            
    result = "".join(tmp)
   
    return result
