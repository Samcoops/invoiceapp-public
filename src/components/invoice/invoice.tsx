'use client';

import s from './invoice.module.scss';

interface iProps {
    scale: number;
    number: string;
    supplier: {
        name: string;
        address: string;
        psc: string;
        ico: string;
        dic: string;
        bank: string;
        bankAccount: string;
    };
    customer: {
        name: string;
        address: string;
        psc: string;
        ico: string;
        dic: string;
    };
    date: {
        start: string;
        did: string;
        last: string;
    };
    text: string[];
    price: number;
}

export default function InvoiceComponent({ scale, number, supplier, customer, date, text, price }: iProps) {
    const dph = Math.round(price * 0.21);

    return (
        <section id={s.section} style={{ transform: `scale(${scale})` }}>
            <div className={`${s.container}`}>
                <header id={s.header}>
                    <div id={s.title}>
                        <b>FAKTURA</b>
                    </div>
                    <span id={s.number}>
                        <b>Číslo faktury: {number}</b>
                    </span>
                </header>

                <div id={s.head}>
                    <div id={s.profiles}>
                        <div id={s.supplier} className={s.profile}>
                            <b>Dodavatel:</b>
                            <div className={s.info}>
                                <div className={s.block}>
                                    <b className={s.name}>{supplier.name}</b>
                                    <span className={s.adress}>{supplier.address}</span>
                                    <span className={s.psc}>{supplier.psc}</span>
                                </div>
                                <div className={s.block}>
                                    <b>IČO:{supplier.ico}</b>
                                    <b>DIČ:{supplier.dic}</b>
                                </div>
                            </div>
                        </div>

                        <div id={s.custumer} className={s.profile}>
                            <b>Odběratel:</b>
                            <div className={s.info}>
                                <div className={s.block}>
                                    <b className={s.name}>{customer.name}</b>
                                    <span className={s.adress}>{customer.address}</span>
                                    <span className={s.psc}>{customer.psc}</span>
                                </div>
                                <div className={s.block}>
                                    <b>IČO:{customer.ico}</b>
                                    <b>DIČ:{customer.dic}</b>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id={s.details}>
                        <div id={s.credentials} className={s.block}>
                            <div className={`${s.item} ${s.border}`}>
                                <b className={s.title}>Banka:</b>
                                <b>{supplier.bank}</b>
                            </div>

                            <div className={`${s.item} ${s.border}`}>
                                <span className={s.title}>Číslo účtu:</span>
                                <span>{supplier.bankAccount}</span>
                            </div>
                            <div className={`${s.item} `} style={{ fontSize: '12px' }}>
                                <p>
                                    Společnost zapsaná v obchodním rejstříku
                                    <br />
                                    vedeném Městským soudem v Praze,
                                    <br />
                                    oddíl C, vložka 178629.
                                </p>
                            </div>
                        </div>

                        <div id={s.payment} className={s.block}>
                            <div className={s.item}>
                                <span>Platební podmínky</span>
                            </div>
                            <div className={s.item}>
                                <span>Datum vystavení faktury:</span>
                                <b>{date.start}</b>
                            </div>
                            <div className={s.item}>
                                <span>Datum uskutečnění plnění:</span>
                                <b>{date.did}</b>
                            </div>
                            <div className={s.item}>
                                <span>Datum splatnosti faktury:</span>
                                <b>{date.last}</b>
                            </div>
                            <div className={s.item}>
                                <span>Forma úhrady:</span>
                                <span style={{ marginRight: '25px' }}>placeno převodem</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id={s.body}>
                    <span>Fakturujeme Vám na základě Vaší objednávky:</span>

                    <div className={s.content}>
                        {text.map((t, i) => (
                            <p key={i}>{t}</p>
                        ))}
                    </div>
                </div>

                <div id={s.footer}>
                    <div id={s.price}>
                        <div className={s.item}>
                            <span>Celková cena bez DPH:</span>
                            <span>DPH sazba 21 %:</span>
                            <b>Celkem k úhradě:</b>
                        </div>
                        <div className={s.item}>
                            <span>{price.toLocaleString('cs-CZ')},00 Kč</span>
                            <span>{dph.toLocaleString('cs-CZ')},00 Kč</span>
                            <b>{(price + dph).toLocaleString('cs-CZ')},00 Kč</b>
                        </div>
                    </div>

                    <div id={s.signature}>
                        <div className={s.relation}>
                            <div className={s.item}>
                                <span>Fakturu za odběratele převzal:</span>
                            </div>
                            <div className={s.item}>
                                <span>Fakturu vystavil:</span>
                            </div>
                        </div>
                        <div className={s.date}>
                            <span>Datum převzetí:</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
