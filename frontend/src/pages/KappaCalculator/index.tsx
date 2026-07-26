import React, { useState, useEffect } from 'react';
import './KappaCalculator.css';

interface HistoryRecord {
  id: string;
  date: string;
  m: number;
  V1: number;
  V: number;
  temp: number;
  kappa: string;
}

export default function KappaCalculator() {
  const [dryness, setDryness] = useState<number>(1.0);
  const [sampleResult, setSampleResult] = useState<string | null>(null);

  const [v1, setV1] = useState<number>(50.0);
  const [v, setV] = useState<number>(25.0);
  const [c, setC] = useState<number>(0.2);
  const [temp, setTemp] = useState<number>(25.0);
  const [m, setM] = useState<number>(1.0);
  const [kappaResult, setKappaResult] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryRecord[]>([]);


  useEffect(() => {
    const saved = localStorage.getItem('kappa_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка чтения истории из localStorage', e);
      }
    }
  }, []);

  // Расчет параметров по ГОСТ
  const handleCalculateSample = () => {
    const text = `Для массы навески ${dryness} г:<br>` +
                 `- Требуемый объем раствора KMnO4 (0.1 моль/дм³): 30 мл<br>` +
                 `- Требуемый объем серной кислоты (2 моль/дм³): 10 мл<br>` +
                 `- Дистиллированная вода для разбавления: до 500 мл<br>` +
                 `*(Убедитесь, что потребление KMnO4 находится в пределах 30-50%)*`;
    setSampleResult(text);
  };

  const handleCalculateKappa = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(v1) || isNaN(v) || isNaN(c) || isNaN(temp) || isNaN(m) || m <= 0) {
      alert('Пожалуйста, заполните все поля корректными значениями.');
      return;
    }

    const tempCorrection = 1 + 0.013 * (25 - temp);

    const kappaVal = (((v1 - v) * c) / 0.1) * (1 / m) * tempCorrection;
    const formattedKappa = kappaVal.toFixed(2);

    setKappaResult(`Рассчитанное число каппа (X): ${formattedKappa}`);

    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      m,
      V1: v1,
      V: v,
      temp,
      kappa: formattedKappa,
    };

    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('kappa_history', JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    if (window.confirm('Очистить всю историю измерений?')) {
      setHistory([]);
      localStorage.removeItem('kappa_history');
    }
  };

  return (
    <div className="kappa-container">
      <h1>Расчет числа каппа по ГОСТ 10070-74</h1>

      <div className="section">
        <h2>1. Расчет навески и параметров подготовки</h2>
        <label>
          Абсолютно сухая масса волокна (или масса навески с учетом влажности), г:
          <input 
            type="number" 
            value={dryness} 
            step="0.001" 
            onChange={(e) => setDryness(parseFloat(e.target.value))} 
          />
        </label>
        <button type="button" onClick={handleCalculateSample}>Рассчитать условия анализа</button>

        {sampleResult && (
          <div className="result" dangerouslySetInnerHTML={{ __html: sampleResult }} />
        )}
      </div>

      <div className="section">
        <h2>2. Расчет числа каппа ($X$)</h2>
        <form onSubmit={handleCalculateKappa}>
          <label>
            Объем тиосульфата натрия в контрольном опыте ($V_1$), мл:
            <input type="number" value={v1} step="0.1" onChange={(e) => setV1(parseFloat(e.target.value))} />
          </label>

          <label>
            Объем тиосульфата натрия на титрование пробы ($V$), мл:
            <input type="number" value={v} step="0.1" onChange={(e) => setV(parseFloat(e.target.value))} />
          </label>

          <label>
            Точная концентрация тиосульфата натрия ($c$), моль/дм³:
            <input type="number" value={c} step="0.001" onChange={(e) => setC(parseFloat(e.target.value))} />
          </label>

          <label>
            Температура раствора при титровании, °C:
            <input type="number" value={temp} step="0.1" onChange={(e) => setTemp(parseFloat(e.target.value))} />
          </label>

          <label>
            Масса абсолютно сухого волокна в навеске ($m$), г:
            <input type="number" value={m} step="0.001" onChange={(e) => setM(parseFloat(e.target.value))} />
          </label>

          <button type="submit">Рассчитать число каппа</button>
        </form>

        {kappaResult && <div className="result"><strong>{kappaResult}</strong></div>}
      </div>

      <div className="section">
        <h2>3. История результатов (LocalStorage)</h2>
        {history.length > 0 ? (
          <>
            <button type="button" className="clear-btn" onClick={handleClearHistory}>Очистить историю</button>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Дата/Время</th>
                  <th>Навеска (г)</th>
                  <th>V1 (мл)</th>
                  <th>V (мл)</th>
                  <th>Темп. (°C)</th>
                  <th>Каппа (X)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.m}</td>
                    <td>{item.V1}</td>
                    <td>{item.V}</td>
                    <td>{item.temp}</td>
                    <td><strong>{item.kappa}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="empty-text">История пока пуста.</p>
        )}
      </div>
    </div>
  );
}