import { Directive, ElementRef, AfterViewInit, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type, Component, Input } from '@angular/core';
import { waitAsync } from 'src/shared/help/waitAsync';
import { IHasUrl } from 'src/shared/IHasUrl';
import { EmbeddedSoundcloudPlayerComponent } from '../components/partials/embedded-soundcloud-player/embedded-soundcloud-player.component';
import { EmbeddedYoutubeComponent } from '../components/partials/embedded-youtube/embedded-youtube.component';

@Component({
  selector: 'app-embedded-title',
  template: `<h4>{{title}}</h4>`,
})
export class EmbeddedHeaderComponent {
  @Input()
  title: string = "No Title";
}

@Directive({
  selector: 'a[appEmbeddedLink]'
})
export class EmbeddedLinkDirective implements AfterViewInit {

  protected urlOriginElementMap = new Map<string, Type<IHasUrl>>();

  constructor(private viewContainer: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver) {
    this.urlOriginElementMap.set("https://soundcloud.com", EmbeddedSoundcloudPlayerComponent); 
    this.urlOriginElementMap.set("https://www.youtube.com", EmbeddedYoutubeComponent); 
  }

  protected createEmbeddedComponent<TComponent>(componentType: Type<TComponent>): TComponent {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    return this.viewContainer.createComponent(componentFactory).instance;
  }

  async ngAfterViewInit(): Promise<void> {
    await waitAsync(0);
    const element:HTMLAnchorElement = this.viewContainer.element.nativeElement;
    const origin = element.origin
    const componentType = this.urlOriginElementMap.get(origin);
    if (!componentType) {
      return;
    }
    element.style.display = "none";
    this.createEmbeddedComponent(EmbeddedHeaderComponent).title = element.textContent;
    this.createEmbeddedComponent(componentType).url = element.href;
  }

}
