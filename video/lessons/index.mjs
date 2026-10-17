// Todas las lecciones con video, en el orden de la app.
import equations from "./equations.mjs";
import signs from "./signs.mjs";
import both from "./both.mjs";
import racionales from "./racionales.mjs";
import combinadas from "./combinadas.mjs";
import problemas from "./problemas.mjs";
import enteros from "./enteros.mjs";
import semejantes from "./semejantes.mjs";
import proporciones from "./proporciones.mjs";
import potencias from "./potencias.mjs";
import funcion from "./funcion.mjs";
import notables from "./notables.mjs";
import porcentajes from "./porcentajes.mjs";
import circulos from "./circulos.mjs";
import pitagoras from "./pitagoras.mjs";
import probabilidad from "./probabilidad-experimental.mjs";
import narraciones from "./lectura-narraciones.mjs";
import interpretacion from "./lectura-interpretacion.mjs";
import argumentos from "./lectura-argumentos.mjs";
import medios from "./lectura-medios.mjs";
import resumen from "./lectura-estrategias-5b.mjs";
import fuentes from "./lectura-noliterarios-6b.mjs";
import figuras from "./lectura-figuras-8b.mjs";
import conflictos from "./lectura-conflictos-8b.mjs";
import simbolos from "./lectura-simbolos-1m.mjs";
import critica from "./lectura-critica-1m.mjs";
import baseValor from "./base-valor-posicional.mjs";
import baseSuma from "./base-suma-resta.mjs";
import baseMult from "./base-multiplicar.mjs";
import baseDiv from "./base-dividir.mjs";
import baseFrac from "./base-fracciones.mjs";
import baseDec from "./base-decimales.mjs";
import multiplos from "./multiplos-divisores.mjs";
import fracSuma from "./fracciones-suma.mjs";
import fracMult from "./fracciones-mult.mjs";
import promedio from "./promedio.mjs";
import areaTri from "./area-triangulos.mjs";
import raices from "./raices.mjs";
import volumen from "./volumen.mjs";
import combinatoria from "./combinatoria.mjs";
import potNeg from "./potencias-negativas.mjs";
import sistemas from "./sistemas.mjs";
import razones from "./razones.mjs";
import mixtos from "./fracciones-mixtos.mjs";
import decMult from "./decimales-mult.mjs";
import patrones from "./patrones.mjs";
import expresiones from "./expresiones.mjs";
import angulos from "./angulos.mjs";
import areaSup from "./area-superficie.mjs";
import graficos from "./graficos.mjs";
import pot10 from "./potencias-10.mjs";
import inecuaciones from "./inecuaciones.mjs";
import angPoli from "./angulos-poligonos.mjs";
import trapecio from "./area-trapecio.mjs";
import plano from "./plano-cartesiano.mjs";
import frecuencias from "./frecuencias.mjs";
import probTeo from "./probabilidad-teorica.mjs";
import muestreo from "./muestreo.mjs";
import propInv from "./proporcion-inversa.mjs";
import entMult from "./enteros-mult.mjs";
import racMult from "./racionales-mult.mjs";
import variacion from "./variacion-porcentual.mjs";
import algProd from "./algebra-producto.mjs";
import isometrias from "./isometrias.mjs";
import cuartiles from "./cuartiles.mjs";
import racOp from "./racionales-operatoria.mjs";
import crecExp from "./crecimiento-exponencial.mjs";
import f2v from "./funcion-dos-variables.mjs";
import sectores from "./sectores-circulares.mjs";
import cono from "./cono.mjs";
import homotecia from "./homotecia.mjs";
import tales from "./tales.mjs";
import semejanza from "./semejanza.mjs";
import dobleEntrada from "./doble-entrada.mjs";
import reglasProb from "./reglas-probabilidad.mjs";
import galton from "./galton.mjs";
import raicesSimp from "./raices-simplificar.mjs";
import raicesEn from "./raices-enesimas.mjs";
import logaritmos from "./logaritmos.mjs";
import fCuad from "./funcion-cuadratica.mjs";
import eCuad from "./ecuacion-cuadratica.mjs";
import fInv from "./funcion-inversa.mjs";
import cambioPct from "./cambio-porcentual.mjs";
import esfera from "./esfera.mjs";
import trigo from "./trigonometria.mjs";
import vectores from "./vectores.mjs";
import varAl from "./variable-aleatoria.mjs";
import perm from "./permutaciones.mjs";
import complejos from "./complejos.mjs";
import complejosMult from "./complejos-mult.mjs";
import dispersion from "./dispersion.mjs";
import probCond from "./probabilidad-condicional.mjs";
import modExpLog from "./modelos-exp-log.mjs";
import circAng from "./circunferencia-angulos.mjs";
import credito from "./credito.mjs";
import sueldo from "./sueldo-impuestos.mjs";
import binomial from "./binomial.mjs";
import normal from "./normal.mjs";
import fPot from "./funcion-potencia.mjs";
import fTrig from "./funciones-trigonometricas.mjs";
import talloHojas from "./tallo-hojas.mjs";
import teselados from "./teselados.mjs";
import construcciones from "./construcciones.mjs";
import pit3d from "./pitagoras-3d.mjs";
import engano from "./graficos-enganosos.mjs";
import euclides from "./euclides.mjs";
import rectaAj from "./recta-ajuste.mjs";
import probSoc from "./probabilidad-sociedad.mjs";
import valAbs from "./valor-absoluto.mjs";
import composicion from "./composicion.mjs";
import limites from "./limites.mjs";
import derivadas from "./derivadas.mjs";
import integrales from "./integrales.mjs";
import interesSimple from "./interes-simple.mjs";
import interesComp from "./interes-compuesto.mjs";
import logBase from "./logaritmo-base.mjs";
import numeroE from "./numero-e.mjs";
import jerarquiaMult from "./jerarquia-mult.mjs";
import jerarquiaParentesis from "./jerarquia-parentesis.mjs";
import jerarquiaEnteros from "./jerarquia-enteros.mjs";
import jerarquiaPotencias from "./jerarquia-potencias.mjs";

export const lessons = [
  interesSimple, interesComp, logBase, numeroE,
  talloHojas, teselados, construcciones, pit3d, engano, euclides, rectaAj, probSoc, valAbs, composicion, limites, derivadas, integrales,
  complejos, complejosMult, dispersion, probCond, modExpLog, circAng, credito, sueldo, binomial, normal, fPot, fTrig,
  raicesSimp, raicesEn, logaritmos, fCuad, eCuad, fInv, cambioPct, esfera, trigo, vectores, varAl, perm,
  racOp, crecExp, f2v, sectores, cono, homotecia, tales, semejanza, dobleEntrada, reglasProb, galton,
  entMult, racMult, variacion, algProd, isometrias, cuartiles,
  pot10, inecuaciones, angPoli, trapecio, plano, frecuencias, probTeo, muestreo, propInv,
  razones, mixtos, decMult, patrones, expresiones, angulos, areaSup, graficos,
  raices, volumen, combinatoria, potNeg, sistemas,
  multiplos, fracSuma, fracMult, promedio, areaTri,
  baseValor, baseSuma, baseMult, baseDiv, baseFrac, baseDec,
  jerarquiaMult, jerarquiaParentesis, jerarquiaEnteros, jerarquiaPotencias,
  equations, signs, both, racionales, combinadas, problemas, enteros, semejantes,
  proporciones, potencias, funcion, notables, porcentajes, circulos, pitagoras,
  probabilidad, narraciones, interpretacion, argumentos, medios, resumen, fuentes,
  figuras, conflictos, simbolos, critica,
];
