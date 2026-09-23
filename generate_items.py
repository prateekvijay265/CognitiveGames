import os
import json

locales_dir = "client/src/locales"

# We need game_items
game_items = {
    "en": {
        "tea-cup": "Tea Cup",
        "bamboo": "Bamboo",
        "orange": "Orange",
        "rice": "Rice",
        "flower": "Flower",
        "home": "Home",
        "rain": "Rain",
        "elephant": "Elephant",
        "peacock": "Peacock",
        "leaf": "Tea Leaf",
        "lemon": "Lemon",
        "teapot": "Teapot",
        "paddy": "Paddy Field",
        "banyan": "Banyan Tree",
        "fish": "Fish",
        "diya": "Diya Lamp",
        "hibiscus": "Hibiscus",
        "coconut": "Coconut"
    },
    "hi": {
        "tea-cup": "चाय का कप",
        "bamboo": "बाँस",
        "orange": "संतरा",
        "rice": "चावल",
        "flower": "फूल",
        "home": "घर",
        "rain": "बारिश",
        "elephant": "हाथी",
        "peacock": "मोर",
        "leaf": "चाय की पत्ती",
        "lemon": "नींबू",
        "teapot": "चायदानी",
        "paddy": "धान का खेत",
        "banyan": "बरगद का पेड़",
        "fish": "मछली",
        "diya": "दीया",
        "hibiscus": "गुड़हल",
        "coconut": "नारियल"
    },
    "as": {
        "tea-cup": "চাহৰ কাপ",
        "bamboo": "বাঁহ",
        "orange": "কমলা",
        "rice": "চাউল",
        "flower": "ফুল",
        "home": "ঘৰ",
        "rain": "বৰষুণ",
        "elephant": "হাতী",
        "peacock": "ময়ূৰ",
        "leaf": "চাহ পাত",
        "lemon": "নেমু",
        "teapot": "কেটলী",
        "paddy": "পথাৰ",
        "banyan": "বট গছ",
        "fish": "মাছ",
        "diya": "চাকি",
        "hibiscus": "জৱা ফুল",
        "coconut": "নাৰিকল"
    },
    "mni": {
        "tea-cup": "Cha Pukham",
        "bamboo": "Waa",
        "orange": "Komla",
        "rice": "Cheng",
        "flower": "Lei",
        "home": "Yum",
        "rain": "Nong",
        "elephant": "Shamu",
        "peacock": "Wahong",
        "leaf": "Cha Mana",
        "lemon": "Champra",
        "teapot": "Ketli",
        "paddy": "Lou",
        "banyan": "Khongnang",
        "fish": "Nga",
        "diya": "Meira",
        "hibiscus": "Athi",
        "coconut": "Yubi"
    },
    "kha": {
        "tea-cup": "Khuri Sha",
        "bamboo": "Siej",
        "orange": "Soh Niamtra",
        "rice": "Khaw",
        "flower": "Syntiew",
        "home": "Iing",
        "rain": "Slap",
        "elephant": "Hati",
        "peacock": "Mairang",
        "leaf": "Sla Sha",
        "lemon": "Sohjew",
        "teapot": "Ketli",
        "paddy": "Kba",
        "banyan": "Diengjri",
        "fish": "Dkha",
        "diya": "Sharak",
        "hibiscus": "Tiew Kulab",
        "coconut": "Soh Niamtra"
    },
    "lus": {
        "tea-cup": "Thingpui No",
        "bamboo": "Mau",
        "orange": "Serthlum",
        "rice": "Buh",
        "flower": "Pangpar",
        "home": "In",
        "rain": "Ruah",
        "elephant": "Sai",
        "peacock": "Arsi",
        "leaf": "Thingpui Hnah",
        "lemon": "Ser",
        "teapot": "Thingpui Bel",
        "paddy": "Loh",
        "banyan": "Bung",
        "fish": "Sangha",
        "diya": "Khawnvar",
        "hibiscus": "Parmawi",
        "coconut": "Nuh"
    }
}

for lang, new_items in game_items.items():
    file_path = os.path.join(locales_dir, f"{lang}.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                current_data = json.load(f)
            except:
                current_data = {}
    else:
        current_data = {}
    
    current_data["game_items"] = new_items
        
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(current_data, f, indent=2, ensure_ascii=False)

print("Game items added.")
