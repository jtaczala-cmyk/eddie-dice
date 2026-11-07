# Eddie's Dice of the Beast

Nieoficjalny prototyp fanowski — ukryty podgląd testowy. Brak afiliacji z zespołem, brak logotypów zespołu i brak tekstów piosenek. To nie jest publikacja na stronie głównej ani wydanie na itch.io.

Po scaleniu tej zmiany GitHub Pages (gałąź `main`, katalog `/`, bez pliku CNAME) serwuje grę pod adresem:

https://stop60.no/eddie-dice/

## Jak grać w przeglądarce

Otwórz `index.html` w aktualnej przeglądarce (Chrome, Firefox, Edge lub Safari), albo wejdź na adres podglądu powyżej. Nie potrzeba serwera deweloperskiego, konta, instalacji, npm ani kompilacji. Gra działa lokalnie i offline: wszystkie pliki gry i obrazy muszą pozostać w tym samym folderze, bo `index.html` odwołuje się do nich ścieżkami względnymi (`style.css`, `engine.js`, `game.js`, `Eddie_Dice_Scene.jpg`, `Eddie_Portrait_Crop.jpg`).

1. Obejrzyj 28-sekundowe intro lub wybierz „Pomiń intro” (także Esc).
2. „Rzuć kośćmi”, klikaj kości do zatrzymania, rzucaj ponownie (maksymalnie 3 rzuty).
3. Kliknij wynik w wolnej kategorii w kolumnie „Ty”. Wynik zapisuje się od razu, również jeśli wynosi zero.
4. Eddie rozgrywa turę. Po 13 rundach porównywane są wyniki wraz z premią górną.

„Zasady” zawierają pełny opis. „Dźwięk” włącza opcjonalne syntetyczne stuki. „Nowa gra” od razu resetuje aktualny pojedynek. Intro odtwarzane jest raz na sesję karty przeglądarki (jeśli sessionStorage jest dostępny); można je ponownie otworzyć ze stopki.

## Implementacja

- Klasyczne 13 kategorii Generała, 5 kości, 3 rzuty, zatrzymywanie kości, premia +35 przy 63 punktach sekcji górnej; brak dodatkowego jokera i premii za kolejne Generały.
- Obie karty, podgląd możliwych wyników, licznik rzutów i rund, sekwencyjne tury, remisy i ekran końcowy.
- AI analizuje wszystkie różne zestawy zatrzymanych kości i dokładny rozkład następnego rzutu. Ocena uwzględnia koszt zużycia kategorii i premię górną. Czasem ryzykuje kolejne rzuty dla karety lub Generała. To sensowna heurystyka z horyzontem jednego rzutu, nie optymalna strategia całej gry.
- Eddie siedzi naprzeciwko gracza przy tym samym stole: duża postać wyłania się zza dalszej krawędzi blatu, a pergaminowy dymek wychodzi od jego głowy. W swojej turze rzuca tymi samymi pięcioma kośćmi na wspólnym stole.
- Animacje Eddiego: oddech i kołysanie (stale), mówienie, rzut, namysł, zadowolenie i lekceważenie; przy prefers-reduced-motion pozostaje statyczny, a dymek nadal się zmienia.
- Oryginalne sentencje (nie teksty piosenek): ok. 40% wypowiedzi po PT/ES/PL/JA/DE/FR, reszta po angielsku. Gdy gracz się zastanawia, Eddie zagaduje co 12–18 s. To dymki tekstowe, nie nagrania ani synteza mowy.
- Animowane kości, reakcja portretu, responsywny układ i ograniczenie animacji przy prefers-reduced-motion. Intro trwa wtedy 4 sekundy.
- Brak zewnętrznych fontów, analityki, kont i backendu.

## Materiały i prawa

Gra używa `Eddie_Dice_Scene.jpg` oraz `Eddie_Portrait_Crop.jpg` (wycinek górnej części dostarczonego plakatu). Nie wyświetla dolnego logotypu ani hasła zespołu. Nie użyto żadnych tekstów piosenek ani nagrań muzycznych. Prototyp jest opisany jako nieoficjalny projekt fanowski i nie deklaruje licencji ani afiliacji.

Przykładowe autorskie wypowiedzi:

- “The chair is yours. The odds are not.”
- “The dice heard your plan. They declined.”
- “Keep what you trust. Throw back what you fear.”
- “Three bones agree. I want the other two to kneel.”
- “You have won the table. Enjoy the silence while it lasts.”

## Weryfikacja i ograniczenia

Podczas przygotowania prototypu sprawdzono 101 asercji zasad (wszystkie 7776 wyników pięciu kości × 13 kategorii oraz przypadki brzegowe), premię górną i strategię. Osobna kontrola interfejsu objęła pomijanie intro, zatrzymywanie kości, limit rzutów, blokowanie kategorii, restart w trakcie tury AI i pełny mecz 13 rund. Granie w przeglądarce nie wymaga Node ani jsdom.

Brak znanych błędów w przetestowanych zasadach i przepływie. Układ nie był jeszcze sprawdzany na fizycznym telefonie. Nie ma zapisu meczu po odświeżeniu, wyboru trudności, dubbingu ani sieciowego multiplayera. Opcjonalny dźwięk zależy od obsługi Web Audio.
