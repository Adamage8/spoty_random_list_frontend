import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfoService, SearchResultItemType, SearchResultType } from '../../service/info.service';
import { TokenService } from 'spotify-auth';
import { get } from 'lodash';

interface SearchResult {
  id: string;
  image: string;
  name: string;
}

const transformSearchResult = (item: SearchResultItemType) => ({
  id: item.id,
  name: item.name,
  image: get(item, 'images[0].url', null),
});

@Component({
  selector: 'app-search-module',
  templateUrl: './search-module.component.html',
  styleUrls: ['./search-module.component.css'],
})
export class SearchModuleComponent {
  @Output() onSelectEmitter = new EventEmitter();
  public constructor(private infoSvc: InfoService, private tokenSvc: TokenService) {}
  artistResults: SearchResult[];
  albumResults: SearchResult[];
  playlistResults: SearchResult[];
  trackResults: SearchResult[];

  selectedId: string;

  onSearch = (values) => {
    this.infoSvc.fetchSearchResults(values.media).subscribe((response: SearchResultType) => {
      this.artistResults = response.artists.items.map(transformSearchResult);
      this.albumResults = response.albums.items.map(transformSearchResult);
      this.playlistResults = response.playlists.items.map(transformSearchResult);
      this.trackResults = response.tracks.items.map(transformSearchResult);
    });
  };

  onSelect = (id: string, name: string) => {
    this.selectedId = id;
    this.onSelectEmitter.emit({ id, name });
  };
}
