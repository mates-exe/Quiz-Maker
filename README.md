# ADT Kvíz - JSON Quiz Application

Interaktivní aplikace pro testování znalostí z předmětů. Aplikace načítá otázky z JSON souboru a umožňuje uživateli procházet kvízem s okamžitou zpětnou vazbou.

## Demo
Fungující ukázky aplikace:
- [ZKY Quiz](https://zky.netlify.app/)
- [ADT Kvíz](https://adt-kviz.netlify.app/)

## Hlavní funkce

- **Načítání otázek z JSON**: Aplikace dynamicky načítá otázky ze souboru `questions.json`
- **Náhodné pořadí otázek**: Otázky jsou při každém spuštění kvízu náhodně seřazeny
- **Okamžitá zpětná vazba**: Uživatel ihned vidí, zda odpověděl správně nebo špatně
- **Automatické posouvání**: Při správné odpovědi se kvíz automaticky posouvá na další otázku
- **Sledování progresu**: Ukazatel průběhu a skóre během kvízu
- **Rekapitulace**: Možnost zobrazit chybné odpovědi na konci kvízu
- **Prohlížení všech otázek**: Možnost zobrazit všechny otázky a správné odpovědi bez spuštění kvízu

## Jak to funguje

1. **Načtení dat**: Aplikace načte otázky ze souboru `questions.json` při načtení stránky
2. **Spuštění kvízu**: Po kliknutí na tlačítko "Spustit kvíz" se otázky náhodně zamíchají
3. **Zodpovídání otázek**: Uživatel vybírá odpovědi na otázky
   - Při správné odpovědi: Odpověď se zvýrazní zeleně a kvíz automaticky přejde na další otázku
   - Při špatné odpovědi: Špatná odpověď se zvýrazní červeně, správná odpověď se označí a uživatel musí kliknout na "Další otázka"
4. **Výsledky**: Na konci kvízu se zobrazí dosažené skóre
5. **Rekapitulace**: Uživatel může zobrazit přehled otázek, na které odpověděl chybně

## Jak upravit otázky

Otázky jsou uloženy v souboru `questions.json` ve formátu:

```json
[
  {
    "id": "unikatni_id",
    "question": "Text otázky (může obsahovat HTML)",
    "options": [
      "Možnost 1",
      "Možnost 2",
      "Možnost 3",
      "Možnost 4",
      "Možnost 5"
    ],
    "correctAnswerIndex": 2  // Index správné odpovědi (počítáno od 0)
  },
  // Další otázky...
]
```

- Pro přidání nové otázky jednoduše přidejte nový objekt do JSON pole
- Pro odstranění otázky odeberte odpovídající objekt z JSON pole
- Pro změnu existující otázky upravte hodnoty v příslušném objektu

## Jak spustit aplikaci lokálně

1. Stáhněte všechny soubory do jednoho adresáře
2. Otevřete soubor `index.html` v moderním webovém prohlížeči

Pro vývoj a testování doporučujeme použít Live Server extension ve Visual Studio Code:

1. Nainstalujte [Visual Studio Code](https://code.visualstudio.com/)
2. Nainstalujte rozšíření [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
3. Otevřete adresář projektu ve VS Code
4. Klikněte pravým tlačítkem na `index.html` a vyberte "Open with Live Server"

Toto vám umožní provádět změny a okamžitě je vidět bez nutnosti manuálně obnovovat stránku.

## Jak publikovat na Netlify

Pro bezplatné hostování aplikace na internetu můžete využít službu Netlify:

1. **Vytvořte si účet na Netlify**
   - Navštivte [Netlify](https://www.netlify.com/) a zaregistrujte se (můžete použít GitHub účet)

2. **Nejjednodušší metoda - přetažení adresáře**
   - Po přihlášení na Netlify přejděte do sekce "Sites"
   - Přetáhněte celou složku projektu (obsahující `index.html` a `questions.json`) do oblasti s nápisem "Drag and drop your site folder here"
   - Netlify automaticky nahraje a publikuje vaši stránku

3. **Získání veřejné URL**
   - Po úspěšném nahrání Netlify vygeneruje náhodnou URL (např. `random-name-123456.netlify.app`)
   - Tuto URL můžete sdílet s ostatními pro přístup k vašemu kvízu

4. **Volitelné: Úprava názvu stránky**
   - V přehledu stránky klikněte na "Site settings" a pak na "Change site name"
   - Zadejte preferovaný název (bude součástí URL jako `vas-nazev.netlify.app`)

5. **Aktualizace obsahu**
   - Pro aktualizaci stačí znovu přetáhnout složku projektu do Netlify
   - Nebo můžete nastavit automatické nasazení propojením s GitHub repozitářem

6. **Pokročilé: Propojení s GitHub**
   - Pokud máte projekt na GitHubu, klikněte na "New site from Git" místo přetažení složky
   - Vyberte svůj GitHub repozitář a nastavte základní adresář
   - Netlify poté automaticky aktualizuje web po každém push do repozitáře

Netlify nabízí mnoho dalších funkcí jako vlastní domény, HTTPS certifikáty a formuláře, které jsou dostupné zdarma i v základním plánu.

## Technologie

- HTML5
- CSS3 (s použitím proměnných pro konzistentní vzhled)
- Vanilla JavaScript (ES6+)
- Asynchronní načítání dat (fetch API)
- Responzivní design pro různé velikosti obrazovek

## Licence

Tato aplikace je volně k použití.
