<script>
  import { onMount, tick } from "svelte";
  import {
    variablesFetched,
    contextElement,
    childAssignmentPending,
    pendingChildDropBackground,
  } from "../../stores/globals";
  import { elements, elementsPendingUpdate } from "../../stores/elements";
  import { cssObject, getId, updateElement } from "../../util";
  import Div from "./Div.svelte";

  import { elementTooltipId, clickedElement } from "../../stores/globals";

  export let element;

  let styleString,
    finalStyleString,
    showTooltip,
    children = [],
    ctrlDown = false,
    ready = null;

  const id = getId("div");

  const getFunctionsToRun = (parentFunction) => {
    const connections = element.grid.connections.filter(
      (connection) => connection.out === parentFunction._id
    );

    const functionsToRun = connections.map((connection) => {
      return element.grid.functions.find((func) => func._id === connection.in);
    });

    return functionsToRun;
  };

  const consoleLog = (args) => {};

  const runFunction = (func) => {
    switch (func.name) {
    }

    const functionsToRun = getFunctionsToRun(func);
    if (functionsToRun.length > 0) {
      functionsToRun.forEach((func) => runFunction(func));
    }
  };

  //implement grid function onClick
  const handleClick = (e) => {
    if (!ctrlDown) {
      return;
    }
    if (!element.grid) return;
    const onClick = element.grid.functions.find(
      (func) => func.name === "onClick"
    );
    if (!onClick) return;
    const functionsToRun = getFunctionsToRun(onClick);
    functionsToRun.forEach((func) => runFunction(func));
  };

  onMount(() => {
    [...cssObject.css, ...cssObject.experimental].forEach((prop) => {
      const propCamel = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      element[propCamel] = element[propCamel] ? element[propCamel] : "";
    });

    element.width = element.width ? element.width : "10px";
    element.height = element.height ? element.height : "10px";
    element.boxSizing = element.boxSizing ? element.boxSizing : "border-box";

    ready = true;
  });

  $: if (element && $clickedElement?._id === element._id) {
    element = $clickedElement;
  }

  $: styleString = `accent-color:${element.accentColor || ""};align-content:${
    element.alignContent || ""
  };align-items:${element.alignItems || ""};align-self:${
    element.alignSelf || ""
  };all:${element.all || ""};animation:${
    element.animation || ""
  };animation-delay:${element.animationDelay || ""};animation-direction:${
    element.animationDirection || ""
  };animation-duration:${element.animationDuration || ""};animation-fill-mode:${
    element.animationFillMode || ""
  };animation-iteration-count:${
    element.animationIterationCount || ""
  };animation-name:${element.animationName || ""};animation-play-state:${
    element.animationPlayState || ""
  };animation-timing-function:${
    element.animationTimingFunction || ""
  };appearance:${element.appearance || ""};aspect-ratio:${
    element.aspectRatio || ""
  };backdrop-filter:${element.backdropFilter || ""};backface-visibility:${
    element.backfaceVisibility || ""
  };background:${element.background || ""};background-attachment:${
    element.backgroundAttachment || ""
  };background-blend-mode:${
    element.backgroundBlendMode || ""
  };background-clip:${element.backgroundClip || ""};background-color:${
    element.backgroundColor || ""
  };background-image:${element.backgroundImage || ""};background-origin:${
    element.backgroundOrigin || ""
  };background-position:${
    element.backgroundPosition || ""
  };background-position-x:${
    element.backgroundPositionX || ""
  };background-position-y:${
    element.backgroundPositionY || ""
  };background-repeat:${element.backgroundRepeat || ""};background-size:${
    element.backgroundSize || ""
  };block-size:${element.blockSize || ""};border:${
    element.border || ""
  };border-block:${element.borderBlock || ""};border-block-color:${
    element.borderBlockColor || ""
  };border-block-end:${element.borderBlockEnd || ""};border-block-end-color:${
    element.borderBlockEndColor || ""
  };border-block-end-style:${
    element.borderBlockEndStyle || ""
  };border-block-end-width:${
    element.borderBlockEndWidth || ""
  };border-block-start:${
    element.borderBlockStart || ""
  };border-block-start-color:${
    element.borderBlockStartColor || ""
  };border-block-start-style:${
    element.borderBlockStartStyle || ""
  };border-block-start-width:${
    element.borderBlockStartWidth || ""
  };border-block-style:${element.borderBlockStyle || ""};border-block-width:${
    element.borderBlockWidth || ""
  };border-bottom:${element.borderBottom || ""};border-bottom-color:${
    element.borderBottomColor || ""
  };border-bottom-left-radius:${
    element.borderBottomLeftRadius || ""
  };border-bottom-right-radius:${
    element.borderBottomRightRadius || ""
  };border-bottom-style:${
    element.borderBottomStyle || ""
  };border-bottom-width:${element.borderBottomWidth || ""};border-collapse:${
    element.borderCollapse || ""
  };border-color:${element.borderColor || ""};border-end-end-radius:${
    element.borderEndEndRadius || ""
  };border-end-start-radius:${
    element.borderEndStartRadius || ""
  };border-image:${element.borderImage || ""};border-image-outset:${
    element.borderImageOutset || ""
  };border-image-repeat:${element.borderImageRepeat || ""};border-image-slice:${
    element.borderImageSlice || ""
  };border-image-source:${element.borderImageSource || ""};border-image-width:${
    element.borderImageWidth || ""
  };border-inline:${element.borderInline || ""};border-inline-color:${
    element.borderInlineColor || ""
  };border-inline-end:${
    element.borderInlineEnd || ""
  };border-inline-end-color:${
    element.borderInlineEndColor || ""
  };border-inline-end-style:${
    element.borderInlineEndStyle || ""
  };border-inline-end-width:${
    element.borderInlineEndWidth || ""
  };border-inline-start:${
    element.borderInlineStart || ""
  };border-inline-start-color:${
    element.borderInlineStartColor || ""
  };border-inline-start-style:${
    element.borderInlineStartStyle || ""
  };border-inline-start-width:${
    element.borderInlineStartWidth || ""
  };border-inline-style:${
    element.borderInlineStyle || ""
  };border-inline-width:${element.borderInlineWidth || ""};border-left:${
    element.borderLeft || ""
  };border-left-color:${element.borderLeftColor || ""};border-left-style:${
    element.borderLeftStyle || ""
  };border-left-width:${element.borderLeftWidth || ""};border-radius:${
    element.borderRadius || ""
  };border-right:${element.borderRight || ""};border-right-color:${
    element.borderRightColor || ""
  };border-right-style:${element.borderRightStyle || ""};border-right-width:${
    element.borderRightWidth || ""
  };border-spacing:${element.borderSpacing || ""};border-start-end-radius:${
    element.borderStartEndRadius || ""
  };border-start-start-radius:${
    element.borderStartStartRadius || ""
  };border-style:${element.borderStyle || ""};border-top:${
    element.borderTop || ""
  };border-top-color:${element.borderTopColor || ""};border-top-left-radius:${
    element.borderTopLeftRadius || ""
  };border-top-right-radius:${
    element.borderTopRightRadius || ""
  };border-top-style:${element.borderTopStyle || ""};border-top-width:${
    element.borderTopWidth || ""
  };border-width:${element.borderWidth || ""};bottom:${
    element.bottom || ""
  };box-decoration-break:${element.boxDecorationBreak || ""};box-shadow:${
    element.boxShadow || ""
  };box-sizing:${element.boxSizing || ""};break-after:${
    element.breakAfter || ""
  };break-before:${element.breakBefore || ""};break-inside:${
    element.breakInside || ""
  };caption-side:${element.captionSide || ""};caret-color:${
    element.caretColor || ""
  };clear:${element.clear || ""};Deprecatedclip:${
    element.Deprecatedclip || ""
  };clip-path:${element.clipPath || ""};color:${
    element.color || ""
  };color-scheme:${element.colorScheme || ""};column-count:${
    element.columnCount || ""
  };column-fill:${element.columnFill || ""};column-gap:${
    element.columnGap || ""
  };column-rule:${element.columnRule || ""};column-rule-color:${
    element.columnRuleColor || ""
  };column-rule-style:${element.columnRuleStyle || ""};column-rule-width:${
    element.columnRuleWidth || ""
  };column-span:${element.columnSpan || ""};column-width:${
    element.columnWidth || ""
  };columns:${element.columns || ""};contain:${element.contain || ""};content:${
    element.content || ""
  };content-visibility:${element.contentVisibility || ""};counter-increment:${
    element.counterIncrement || ""
  };counter-reset:${element.counterReset || ""};counter-set:${
    element.counterSet || ""
  };cursor:${element.cursor || ""};direction:${
    element.direction || ""
  };display:${element.display || ""};empty-cells:${
    element.emptyCells || ""
  };filter:${element.filter || ""};flex:${element.flex || ""};flex-basis:${
    element.flexBasis || ""
  };flex-direction:${element.flexDirection || ""};flex-flow:${
    element.flexFlow || ""
  };flex-grow:${element.flexGrow || ""};flex-shrink:${
    element.flexShrink || ""
  };flex-wrap:${element.flexWrap || ""};float:${element.float || ""};font:${
    element.font || ""
  };font-family:${element.fontFamily || ""};font-feature-settings:${
    element.fontFeatureSettings || ""
  };font-kerning:${element.fontKerning || ""};font-language-override:${
    element.fontLanguageOverride || ""
  };font-optical-sizing:${element.fontOpticalSizing || ""};font-size:${
    element.fontSize || ""
  };font-size-adjust:${element.fontSizeAdjust || ""};font-stretch:${
    element.fontStretch || ""
  };font-style:${element.fontStyle || ""};font-synthesis:${
    element.fontSynthesis || ""
  };font-variant:${element.fontVariant || ""};font-variant-alternates:${
    element.fontVariantAlternates || ""
  };font-variant-caps:${
    element.fontVariantCaps || ""
  };font-variant-east-asian:${
    element.fontVariantEastAsian || ""
  };font-variant-ligatures:${
    element.fontVariantLigatures || ""
  };font-variant-numeric:${
    element.fontVariantNumeric || ""
  };font-variant-position:${
    element.fontVariantPosition || ""
  };font-variation-settings:${
    element.fontVariationSettings || ""
  };font-weight:${element.fontWeight || ""};forced-color-adjust:${
    element.forcedColorAdjust || ""
  };gap:${element.gap || ""};grid:${element.grid || ""};grid-area:${
    element.gridArea || ""
  };grid-auto-columns:${element.gridAutoColumns || ""};grid-auto-flow:${
    element.gridAutoFlow || ""
  };grid-auto-rows:${element.gridAutoRows || ""};grid-column:${
    element.gridColumn || ""
  };grid-column-end:${element.gridColumnEnd || ""};grid-column-start:${
    element.gridColumnStart || ""
  };grid-row:${element.gridRow || ""};grid-row-end:${
    element.gridRowEnd || ""
  };grid-row-start:${element.gridRowStart || ""};grid-template:${
    element.gridTemplate || ""
  };grid-template-areas:${
    element.gridTemplateAreas || ""
  };grid-template-columns:${
    element.gridTemplateColumns || ""
  };grid-template-rows:${element.gridTemplateRows || ""};hanging-punctuation:${
    element.hangingPunctuation || ""
  };height:${element.height || ""};hyphenate-character:${
    element.hyphenateCharacter || ""
  };hyphens:${element.hyphens || ""};image-orientation:${
    element.imageOrientation || ""
  };image-rendering:${element.imageRendering || ""};Deprecatedime-mode:${
    element.DeprecatedimeMode || ""
  };inline-size:${element.inlineSize || ""};inset:${
    element.inset || ""
  };inset-block:${element.insetBlock || ""};inset-block-end:${
    element.insetBlockEnd || ""
  };inset-block-start:${element.insetBlockStart || ""};inset-inline:${
    element.insetInline || ""
  };inset-inline-end:${element.insetInlineEnd || ""};inset-inline-start:${
    element.insetInlineStart || ""
  };isolation:${element.isolation || ""};justify-content:${
    element.justifyContent || ""
  };justify-items:${element.justifyItems || ""};justify-self:${
    element.justifySelf || ""
  };left:${element.left || ""};letter-spacing:${
    element.letterSpacing || ""
  };line-break:${element.lineBreak || ""};line-height:${
    element.lineHeight || ""
  };list-style:${element.listStyle || ""};list-style-image:${
    element.listStyleImage || ""
  };list-style-position:${element.listStylePosition || ""};list-style-type:${
    element.listStyleType || ""
  };margin:${element.margin || ""};margin-block:${
    element.marginBlock || ""
  };margin-block-end:${element.marginBlockEnd || ""};margin-block-start:${
    element.marginBlockStart || ""
  };margin-bottom:${element.marginBottom || ""};margin-inline:${
    element.marginInline || ""
  };margin-inline-end:${element.marginInlineEnd || ""};margin-inline-start:${
    element.marginInlineStart || ""
  };margin-left:${element.marginLeft || ""};margin-right:${
    element.marginRight || ""
  };margin-top:${element.marginTop || ""};mask:${
    element.mask || ""
  };mask-border:${element.maskBorder || ""};mask-border-mode:${
    element.maskBorderMode || ""
  };mask-border-outset:${element.maskBorderOutset || ""};mask-border-repeat:${
    element.maskBorderRepeat || ""
  };mask-border-slice:${element.maskBorderSlice || ""};mask-border-source:${
    element.maskBorderSource || ""
  };mask-border-width:${element.maskBorderWidth || ""};mask-clip:${
    element.maskClip || ""
  };mask-composite:${element.maskComposite || ""};mask-image:${
    element.maskImage || ""
  };mask-mode:${element.maskMode || ""};mask-origin:${
    element.maskOrigin || ""
  };mask-position:${element.maskPosition || ""};mask-repeat:${
    element.maskRepeat || ""
  };mask-size:${element.maskSize || ""};mask-type:${
    element.maskType || ""
  };max-block-size:${element.maxBlockSize || ""};max-height:${
    element.maxHeight || ""
  };max-inline-size:${element.maxInlineSize || ""};max-width:${
    element.maxWidth || ""
  };min-block-size:${element.minBlockSize || ""};min-height:${
    element.minHeight || ""
  };min-inline-size:${element.minInlineSize || ""};min-width:${
    element.minWidth || ""
  };mix-blend-mode:${element.mixBlendMode || ""};object-fit:${
    element.objectFit || ""
  };object-position:${element.objectPosition || ""};offset:${
    element.offset || ""
  };offset-anchor:${element.offsetAnchor || ""};offset-distance:${
    element.offsetDistance || ""
  };offset-path:${element.offsetPath || ""};offset-rotate:${
    element.offsetRotate || ""
  };opacity:${element.opacity || ""};order:${element.order || ""};orphans:${
    element.orphans || ""
  };outline:${element.outline || ""};outline-color:${
    element.outlineColor || ""
  };outline-offset:${element.outlineOffset || ""};outline-style:${
    element.outlineStyle || ""
  };outline-width:${element.outlineWidth || ""};overflow:${
    element.overflow || ""
  };overflow-anchor:${element.overflowAnchor || ""};overflow-block:${
    element.overflowBlock || ""
  };overflow-clip-margin:${element.overflowClipMargin || ""};overflow-inline:${
    element.overflowInline || ""
  };overflow-wrap:${element.overflowWrap || ""};overflow-x:${
    element.overflowX || ""
  };overflow-y:${element.overflowY || ""};overscroll-behavior:${
    element.overscrollBehavior || ""
  };overscroll-behavior-block:${
    element.overscrollBehaviorBlock || ""
  };overscroll-behavior-inline:${
    element.overscrollBehaviorInline || ""
  };overscroll-behavior-x:${
    element.overscrollBehaviorX || ""
  };overscroll-behavior-y:${element.overscrollBehaviorY || ""};padding:${
    element.padding || ""
  };padding-block:${element.paddingBlock || ""};padding-block-end:${
    element.paddingBlockEnd || ""
  };padding-block-start:${element.paddingBlockStart || ""};padding-bottom:${
    element.paddingBottom || ""
  };padding-inline:${element.paddingInline || ""};padding-inline-end:${
    element.paddingInlineEnd || ""
  };padding-inline-start:${element.paddingInlineStart || ""};padding-left:${
    element.paddingLeft || ""
  };padding-right:${element.paddingRight || ""};padding-top:${
    element.paddingTop || ""
  };page-break-after:${element.pageBreakAfter || ""};page-break-before:${
    element.pageBreakBefore || ""
  };page-break-inside:${element.pageBreakInside || ""};paint-order:${
    element.paintOrder || ""
  };perspective:${element.perspective || ""};perspective-origin:${
    element.perspectiveOrigin || ""
  };place-content:${element.placeContent || ""};place-items:${
    element.placeItems || ""
  };place-self:${element.placeSelf || ""};pointer-events:${
    element.pointerEvents || ""
  };position:${element.position || ""};print-color-adjust:${
    element.printColorAdjust || ""
  };quotes:${element.quotes || ""};resize:${element.resize || ""};right:${
    element.right || ""
  };rotate:${element.rotate || ""};row-gap:${
    element.rowGap || ""
  };ruby-position:${element.rubyPosition || ""};scale:${
    element.scale || ""
  };scroll-behavior:${element.scrollBehavior || ""};scroll-margin:${
    element.scrollMargin || ""
  };scroll-margin-block:${
    element.scrollMarginBlock || ""
  };scroll-margin-block-end:${
    element.scrollMarginBlockEnd || ""
  };scroll-margin-block-start:${
    element.scrollMarginBlockStart || ""
  };scroll-margin-bottom:${
    element.scrollMarginBottom || ""
  };scroll-margin-inline:${
    element.scrollMarginInline || ""
  };scroll-margin-inline-end:${
    element.scrollMarginInlineEnd || ""
  };scroll-margin-inline-start:${
    element.scrollMarginInlineStart || ""
  };scroll-margin-left:${element.scrollMarginLeft || ""};scroll-margin-right:${
    element.scrollMarginRight || ""
  };scroll-margin-top:${element.scrollMarginTop || ""};scroll-padding:${
    element.scrollPadding || ""
  };scroll-padding-block:${
    element.scrollPaddingBlock || ""
  };scroll-padding-block-end:${
    element.scrollPaddingBlockEnd || ""
  };scroll-padding-block-start:${
    element.scrollPaddingBlockStart || ""
  };scroll-padding-bottom:${
    element.scrollPaddingBottom || ""
  };scroll-padding-inline:${
    element.scrollPaddingInline || ""
  };scroll-padding-inline-end:${
    element.scrollPaddingInlineEnd || ""
  };scroll-padding-inline-start:${
    element.scrollPaddingInlineStart || ""
  };scroll-padding-left:${
    element.scrollPaddingLeft || ""
  };scroll-padding-right:${
    element.scrollPaddingRight || ""
  };scroll-padding-top:${element.scrollPaddingTop || ""};scroll-snap-align:${
    element.scrollSnapAlign || ""
  };scroll-snap-stop:${element.scrollSnapStop || ""};scroll-snap-type:${
    element.scrollSnapType || ""
  };scrollbar-color:${element.scrollbarColor || ""};scrollbar-gutter:${
    element.scrollbarGutter || ""
  };scrollbar-width:${element.scrollbarWidth || ""};shape-image-threshold:${
    element.shapeImageThreshold || ""
  };shape-margin:${element.shapeMargin || ""};shape-outside:${
    element.shapeOutside || ""
  };tab-size:${element.tabSize || ""};table-layout:${
    element.tableLayout || ""
  };text-align:${element.textAlign || ""};text-align-last:${
    element.textAlignLast || ""
  };text-combine-upright:${element.textCombineUpright || ""};text-decoration:${
    element.textDecoration || ""
  };text-decoration-color:${
    element.textDecorationColor || ""
  };text-decoration-line:${
    element.textDecorationLine || ""
  };text-decoration-skip-ink:${
    element.textDecorationSkipInk || ""
  };text-decoration-style:${
    element.textDecorationStyle || ""
  };text-decoration-thickness:${
    element.textDecorationThickness || ""
  };text-emphasis:${element.textEmphasis || ""};text-emphasis-color:${
    element.textEmphasisColor || ""
  };text-emphasis-position:${
    element.textEmphasisPosition || ""
  };text-emphasis-style:${element.textEmphasisStyle || ""};text-indent:${
    element.textIndent || ""
  };text-justify:${element.textJustify || ""};text-orientation:${
    element.textOrientation || ""
  };text-overflow:${element.textOverflow || ""};text-rendering:${
    element.textRendering || ""
  };text-shadow:${element.textShadow || ""};text-transform:${
    element.textTransform || ""
  };text-underline-offset:${
    element.textUnderlineOffset || ""
  };text-underline-position:${element.textUnderlinePosition || ""};top:${
    element.top || ""
  };touch-action:${element.touchAction || ""};transform:${
    element.transform || ""
  };transform-box:${element.transformBox || ""};transform-origin:${
    element.transformOrigin || ""
  };transform-style:${element.transformStyle || ""};transition:${
    element.transition || ""
  };transition-delay:${element.transitionDelay || ""};transition-duration:${
    element.transitionDuration || ""
  };transition-property:${
    element.transitionProperty || ""
  };transition-timing-function:${
    element.transitionTimingFunction || ""
  };translate:${element.translate || ""};unicode-bidi:${
    element.unicodeBidi || ""
  };user-select:${element.userSelect || ""};vertical-align:${
    element.verticalAlign || ""
  };visibility:${element.visibility || ""};white-space:${
    element.whiteSpace || ""
  };widows:${element.widows || ""};width:${element.width || ""};will-change:${
    element.willChange || ""
  };word-break:${element.wordBreak || ""};word-spacing:${
    element.wordSpacing || ""
  };writing-mode:${element.writingMode || ""};z-index:${
    element.zIndex || ""
  };align-tracks:${element.alignTracks || ""};animation-composition:${
    element.animationComposition || ""
  };animation-timeline:${
    element.animationTimeline || ""
  };contain-intrinsic-block-size:${
    element.containIntrinsicBlockSize || ""
  };contain-intrinsic-height:${
    element.containIntrinsicHeight || ""
  };contain-intrinsic-inline-size:${
    element.containIntrinsicInlineSize || ""
  };contain-intrinsic-size:${
    element.containIntrinsicSize || ""
  };contain-intrinsic-width:${
    element.containIntrinsicWidth || ""
  };image-resolution:${element.imageResolution || ""};initial-letter:${
    element.initialLetter || ""
  };initial-letter-align:${element.initialLetterAlign || ""};justify-tracks:${
    element.justifyTracks || ""
  };line-height-step:${element.lineHeightStep || ""};margin-trim:${
    element.marginTrim || ""
  };mastimesonry-auto-flow:${element.masonryAutoFlow || ""};math-depth:${
    element.mathDepth || ""
  };math-shift:${element.mathShift || ""};math-style:${
    element.mathStyle || ""
  };offset-position:${element.offsetPosition || ""};ruby-align:${
    element.rubyAlign || ""
  };scroll-timeline:${element.scrollTimeline || ""};scroll-timeline-axis:${
    element.scrollTimelineAxis || ""
  };scroll-timeline-name:${
    element.scrollTimelineName || ""
  };text-decoration-skip:${element.textDecorationSkip || ""};text-size-adjust:${
    element.textSizeAdjust || ""
  };`;

  $: if (styleString) {
    finalStyleString = getFinalStyleString();
  }

  const getFinalStyleString = () => {
    let splitArr = styleString.split(";");
    splitArr.pop();
    splitArr = splitArr.filter((style) => {
      let splitStyle = style.split(":");
      if (splitStyle[1].length === 0) {
        return false;
      }
      return true;
    });

    return splitArr.join(";") + ";";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Control" && !ctrlDown) {
      ctrlDown = true;
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Control") {
      ctrlDown = false;
    }
  };

  $: if (element.parentOf) {
    children = element.parentOf.map((childId) => {
      return $elements.find((element) => element._id === childId);
    });
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
{#if ready}
  <div
    class="element"
    style={`width: ${element.width}; height: ${element.height};`}
    on:dblclick={(e) => {
      if ($childAssignmentPending) return;
      e.stopPropagation();
      showTooltip = true;
      $elementTooltipId = element._id;
      $clickedElement = element;
      $variablesFetched = false;
    }}
    on:click={async (e) => {
      e.stopPropagation();
      if ($childAssignmentPending && $contextElement._id !== element._id) {
        const oldParent = $elements.find(
          (el) => el._id === $contextElement.childOf
        );
        if (oldParent) {
          oldParent.parentOf = oldParent.parentOf.filter(
            (child) => child !== $contextElement._id
          );
        }
        $elements.find((el) => el._id === $contextElement._id).childOf =
          element._id;

        element.parentOf = [...element.parentOf, $contextElement._id];
        await updateElement($contextElement);
        $childAssignmentPending = null;
        $contextElement = null;
        $elements = $elements;
      }
      handleClick(e);
    }}
    on:keypress={(e) => {
      handleKeyDown(e);
    }}
    on:contextmenu={(e) => {
      e.preventDefault();
      e.stopPropagation();
      if ($contextElement?._id === element._id) {
        $contextElement = null;
      } else {
        $contextElement = element;
      }
      if ($elementTooltipId) {
        $clickedElement = element;
        $elementTooltipId = element._id;
      }
      $childAssignmentPending = false;
    }}
    on:mouseover={async (e) => {
      e.stopPropagation();
      if ($childAssignmentPending && $contextElement._id !== element._id) {
        $pendingChildDropBackground = element._id;
      }
    }}
    on:focus
    on:mouseout={(e) => {
      $pendingChildDropBackground = null;
    }}
    on:blur
  >
    {#if element.type === "div"}
      <Div
        id={element._id}
        key={element._id}
        name={element.name || element._id}
        styleString={finalStyleString}
        content={element.content}
      >
        {#each children as child}
          <svelte:self element={child} />
        {/each}
      </Div>
    {/if}
  </div>
{/if}

<style>
  .element {
    height: fit-content;
    width: fit-content;
    cursor: pointer;
  }
</style>
