// PAUSE — anteprima di 3 proposte di terzo tema icone (Linea · Essenziale ·
// Soft Neon). Non modifica il motore dei temi: è solo un mockup per scegliere.
// L'utente apre la pagina dal profilo → "Prova nuovi temi".
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop, Rect } from "react-native-svg";
import Ionicons from "@react-native-vector-icons/ionicons";

import { Screen } from "@/src/components/screen";
import { makeStyles, useTheme, spacing, radius, typography, withAlpha } from "@/src/theme";

// Path condivisi (gli stessi di holo-icons, cosí il confronto resta coerente).
const BULB = "M12 3.4 C8.4 3.4 5.7 6.1 5.7 9.4 C5.7 11.6 6.9 13 8.1 14.2 C8.8 14.9 9.3 15.6 9.5 16.6 H14.5 C14.7 15.6 15.2 14.9 15.9 14.2 C17.1 13 18.3 11.6 18.3 9.4 C18.3 6.1 15.6 3.4 12 3.4 Z";
const BOOK = "M12 6.6 C10 5.3 7.5 4.9 5 5.3 V18 C7.5 17.6 10 18 12 19.2 C14 18 16.5 17.6 19 18 V5.3 C16.5 4.9 14 5.3 12 6.6 Z";
// Categoria mock = "pianeta" (viola Spazio).
const PLANET_C = { cx: 12, cy: 12, r: 6.8 };
const PLANET_RING = "M4.2 11 C7 7.6 15 7.6 19.8 11 C17 14.6 9 14.6 4.2 11 Z";

// ──────────────────────────────────────────────────────────────
// Mockup A — Linea / Ink Sketch
// Tratto d'inchiostro leggero + sfondo "carta avorio". Analogico, calmo.
function InkIcon({ pathOrCircle, size = 44 }: { pathOrCircle: "bulb" | "book" | "clock" | "planet"; size?: number }) {
  const INK = "#2A1E12";
  const paper = "#F3E8CE";
  const sw = 1.6;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 4, backgroundColor: paper, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Svg width={size * 0.82} height={size * 0.82} viewBox="0 0 24 24">
        {pathOrCircle === "bulb" ? (
          <>
            <Path d={BULB} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M9.6 18.3 H14.4" stroke={INK} strokeWidth={sw} strokeLinecap="round" />
            <Path d="M10.5 20.5 H13.5" stroke={INK} strokeWidth={sw} strokeLinecap="round" />
            {/* Hatching tratteggio */}
            <Path d="M7 9.5 L8.5 8" stroke={INK} strokeWidth={0.6} opacity={0.55} />
            <Path d="M7.5 11 L9 9.5" stroke={INK} strokeWidth={0.6} opacity={0.55} />
            <Path d="M8 12.5 L9.5 11" stroke={INK} strokeWidth={0.6} opacity={0.55} />
          </>
        ) : pathOrCircle === "book" ? (
          <>
            <Path d={BOOK} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 6.6 V19.2" stroke={INK} strokeWidth={sw} />
            <Path d="M6 8 L10 7.5" stroke={INK} strokeWidth={0.7} opacity={0.5} />
            <Path d="M6 10 L10 9.5" stroke={INK} strokeWidth={0.7} opacity={0.5} />
            <Path d="M14 7.5 L18 8" stroke={INK} strokeWidth={0.7} opacity={0.5} />
            <Path d="M14 9.5 L18 10" stroke={INK} strokeWidth={0.7} opacity={0.5} />
          </>
        ) : pathOrCircle === "clock" ? (
          <>
            <Circle cx={12} cy={12.4} r={8.4} stroke={INK} strokeWidth={sw} fill="none" />
            <Path d="M12 7.6 V12.4 L15.6 13.9" stroke={INK} strokeWidth={sw} strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <Circle cx={PLANET_C.cx} cy={PLANET_C.cy} r={PLANET_C.r} stroke={INK} strokeWidth={sw} fill="none" />
            <Path d={PLANET_RING} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" />
            {/* Puntini ombra */}
            <Circle cx={10} cy={10.5} r={0.5} fill={INK} opacity={0.6} />
            <Circle cx={13.5} cy={13} r={0.6} fill={INK} opacity={0.6} />
          </>
        )}
      </Svg>
    </View>
  );
}

// ──────────────────────────────────────────────────────────────
// Mockup B — Essenziale / Flat monochrome
// Un solo colore (accento), glifo pieno, zero decorazioni.
function FlatIcon({ pathOrCircle, size = 44, brand }: { pathOrCircle: "bulb" | "book" | "clock" | "planet"; size?: number; brand: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size * 0.92} height={size * 0.92} viewBox="0 0 24 24">
        {pathOrCircle === "bulb" ? (
          <>
            <Path d={BULB} fill={brand} />
            <Path d="M9.6 18.3 H14.4" stroke={brand} strokeWidth={1.6} strokeLinecap="round" />
            <Path d="M10.5 20.5 H13.5" stroke={brand} strokeWidth={1.6} strokeLinecap="round" />
          </>
        ) : pathOrCircle === "book" ? (
          <>
            <Path d={BOOK} fill={brand} />
          </>
        ) : pathOrCircle === "clock" ? (
          <>
            <Circle cx={12} cy={12.4} r={8.4} fill={brand} />
            <Path d="M12 7.6 V12.4 L15.6 13.9" stroke="#FFFFFF" strokeWidth={1.7} strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <Circle cx={12} cy={12} r={6.8} fill={brand} />
            <Path d={PLANET_RING} fill={brand} opacity={0.55} />
          </>
        )}
      </Svg>
    </View>
  );
}

// ──────────────────────────────────────────────────────────────
// Mockup C — Soft Neon / glow doppio stroke
// Contorno gradiente + alone colorato tenue dietro: playful ma pacato.
function NeonIcon({ pathOrCircle, size = 44, brand, brandSecondary, g0, g1 }:
  { pathOrCircle: "bulb" | "book" | "clock" | "planet"; size?: number; brand: string; brandSecondary: string; g0: string; g1: string }) {
  const sId = `neon-${pathOrCircle}`;
  const haloId = `halo-${pathOrCircle}`;
  const sw = 2.0;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size * 0.96} height={size * 0.96} viewBox="0 0 24 24">
        <Defs>
          <SvgGradient id={sId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={g0} />
            <Stop offset="0.5" stopColor={brandSecondary} />
            <Stop offset="1" stopColor={g1} />
          </SvgGradient>
          <SvgGradient id={haloId} x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={brand} stopOpacity={0.0} />
            <Stop offset="1" stopColor={brand} stopOpacity={0.22} />
          </SvgGradient>
        </Defs>
        <Rect x={0} y={0} width={24} height={24} rx={6} fill={`url(#${haloId})`} />
        {pathOrCircle === "bulb" ? (
          <>
            <Path d={BULB} stroke={`url(#${sId})`} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={BULB} stroke={brand} strokeWidth={0.9} fill="none" opacity={0.5} />
            <Path d="M9.6 18.3 H14.4" stroke={`url(#${sId})`} strokeWidth={sw} strokeLinecap="round" />
            <Path d="M10.5 20.5 H13.5" stroke={`url(#${sId})`} strokeWidth={sw} strokeLinecap="round" />
          </>
        ) : pathOrCircle === "book" ? (
          <>
            <Path d={BOOK} stroke={`url(#${sId})`} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 6.6 V19.2" stroke={`url(#${sId})`} strokeWidth={sw} />
          </>
        ) : pathOrCircle === "clock" ? (
          <>
            <Circle cx={12} cy={12.4} r={8.4} stroke={`url(#${sId})`} strokeWidth={sw} fill="none" />
            <Path d="M12 7.6 V12.4 L15.6 13.9" stroke={`url(#${sId})`} strokeWidth={sw} strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <Circle cx={12} cy={12} r={6.8} stroke={`url(#${sId})`} strokeWidth={sw} fill="none" />
            <Path d={PLANET_RING} stroke={`url(#${sId})`} strokeWidth={sw} fill="none" strokeLinecap="round" />
          </>
        )}
      </Svg>
    </View>
  );
}

// ──────────────────────────────────────────────────────────────
// Riga icone demo + mini card storia stilizzata, per vedere il badge in uso.
function MockBadge({ renderIcon }: { renderIcon: (name: "book" | "planet" | "clock") => React.ReactNode }) {
  const { colors } = useTheme();
  const styles = useBadgeStyles();
  return (
    <View style={[styles.badge, { backgroundColor: withAlpha(colors.surface, 0.6), borderColor: withAlpha(colors.muted, 0.5) }]}>
      <View style={styles.cell}>{renderIcon("book")}<Text style={[styles.cellTxt, { color: colors.onSurface }]}>Curiosità</Text></View>
      <View style={[styles.divider, { backgroundColor: withAlpha(colors.muted, 0.4) }]} />
      <View style={styles.cell}>{renderIcon("planet")}<Text style={[styles.cellTxt, { color: colors.onSurface }]}>Spazio</Text></View>
      <View style={[styles.divider, { backgroundColor: withAlpha(colors.muted, 0.4) }]} />
      <View style={styles.cell}>{renderIcon("clock")}<Text style={[styles.cellTxt, { color: colors.onSurface }]}>3 min</Text></View>
    </View>
  );
}

export default function ThemePreviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <Screen testID="theme-preview-screen">
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable testID="theme-preview-back" onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.title}>Prova nuovi temi</Text>
        <Text style={styles.subtitle}>Tre proposte, scegli quella che ti piace di più.</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]} showsVerticalScrollIndicator={false}>
        {/* ── Mockup A — Linea ── */}
        <View style={styles.card} testID="mockup-linea">
          <View style={styles.cardHead}>
            <Text style={styles.name}>Linea</Text>
            <Text style={styles.tag}>Analogico · Calmo</Text>
          </View>
          <Text style={styles.desc}>
            Illustrazione a tratto d&apos;inchiostro su un piccolo riquadro di carta avorio. Caldo, da quaderno di appunti — perfetto per leggere senza fatica.
          </Text>
          <View style={styles.iconsRow}>
            <InkIcon pathOrCircle="bulb" />
            <InkIcon pathOrCircle="book" />
            <InkIcon pathOrCircle="planet" />
            <InkIcon pathOrCircle="clock" />
          </View>
          <MockBadge
            renderIcon={(n) => (
              <InkIcon pathOrCircle={n === "book" ? "book" : n === "planet" ? "planet" : "clock"} size={30} />
            )}
          />
        </View>

        {/* ── Mockup B — Essenziale ── */}
        <View style={styles.card} testID="mockup-essenziale">
          <View style={styles.cardHead}>
            <Text style={styles.name}>Essenziale</Text>
            <Text style={styles.tag}>Minimale · Pulito</Text>
          </View>
          <Text style={styles.desc}>
            Un solo colore (quello dell&apos;accento di PAUSE), glifo pieno, zero decorazioni. Massima leggibilità, zero rumore visivo.
          </Text>
          <View style={styles.iconsRow}>
            <FlatIcon pathOrCircle="bulb" brand={colors.brand} />
            <FlatIcon pathOrCircle="book" brand={colors.brand} />
            <FlatIcon pathOrCircle="planet" brand={colors.brand} />
            <FlatIcon pathOrCircle="clock" brand={colors.brand} />
          </View>
          <MockBadge
            renderIcon={(n) => (
              <FlatIcon pathOrCircle={n === "book" ? "book" : n === "planet" ? "planet" : "clock"} size={30} brand={colors.brand} />
            )}
          />
        </View>

        {/* ── Mockup C — Soft Neon ── */}
        <View style={styles.card} testID="mockup-soft-neon">
          <View style={styles.cardHead}>
            <Text style={styles.name}>Soft Neon</Text>
            <Text style={styles.tag}>Vivace · Pacato</Text>
          </View>
          <Text style={styles.desc}>
            Doppio tratto con alone colorato tenue dietro il glifo: moderno e giocoso, ma senza strillare. Un passo in più rispetto all&apos;olografico.
          </Text>
          <View style={styles.iconsRow}>
            <NeonIcon pathOrCircle="bulb" brand={colors.brand} brandSecondary={colors.brandSecondary} g0={colors.gradient[0]} g1={colors.gradient[1]} />
            <NeonIcon pathOrCircle="book" brand={colors.brand} brandSecondary={colors.brandSecondary} g0={colors.gradient[0]} g1={colors.gradient[1]} />
            <NeonIcon pathOrCircle="planet" brand={colors.brand} brandSecondary={colors.brandSecondary} g0={colors.gradient[0]} g1={colors.gradient[1]} />
            <NeonIcon pathOrCircle="clock" brand={colors.brand} brandSecondary={colors.brandSecondary} g0={colors.gradient[0]} g1={colors.gradient[1]} />
          </View>
          <MockBadge
            renderIcon={(n) => (
              <NeonIcon pathOrCircle={n === "book" ? "book" : n === "planet" ? "planet" : "clock"} size={30}
                brand={colors.brand} brandSecondary={colors.brandSecondary} g0={colors.gradient[0]} g1={colors.gradient[1]} />
            )}
          />
        </View>

        <Text style={styles.footer}>
          Dimmi quale preferisci (Linea · Essenziale · Soft Neon) e lo installo come terzo tema insieme a Olografico e 3D.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const useStyles = makeStyles((colors) => ({
  header: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "flex-start", justifyContent: "center" },
  title: { fontFamily: typography.displayHero, fontSize: 28, color: colors.onSurface, marginTop: spacing.xs },
  subtitle: { fontFamily: typography.body, fontSize: 13, color: colors.muted, marginTop: 4 },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.lg },
  card: {
    borderRadius: radius.lg, padding: spacing.lg, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: withAlpha(colors.muted, 0.35), gap: spacing.md,
  },
  cardHead: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm },
  name: { fontFamily: typography.displayHero, fontSize: 22, color: colors.onSurface },
  tag: { fontFamily: typography.bodyMedium, fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.6 },
  desc: { fontFamily: typography.body, fontSize: 13.5, lineHeight: 19, color: colors.onSurface },
  iconsRow: { flexDirection: "row", gap: spacing.md, alignItems: "center", paddingVertical: spacing.sm, justifyContent: "flex-start" },
  footer: { fontFamily: typography.bodyMedium, fontSize: 12, color: colors.muted, textAlign: "center", marginTop: spacing.md, fontStyle: "italic" },
}));

const useBadgeStyles = makeStyles(() => ({
  badge: { flexDirection: "row", borderRadius: 14, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 12, alignItems: "center" },
  cell: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" },
  cellTxt: { fontSize: 12 },
  divider: { width: 1, height: 20 },
}));